/* @layer tests @kind test */
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { afterAll, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import { consentOf, createBed, GAME, loaded, resolveLike, RESOLVED } from './world-packages.fixtures';

const engine = vi.hoisted(() => ({ installPackages: vi.fn(), readOptionsSchema: vi.fn(), resolvePackages: vi.fn(), readRuntime: vi.fn() }));

vi.mock('@archipelia/engine', async (original) => ({ ...(await original<object>()), ...engine }));

const { commitInstall } = await import('../src/install/commit-install');
const { installFromFile } = await import('../src/install/install-from-file');
const { previewFilePackages } = await import('../src/install/preview-file-packages');

const bed = createBed();

beforeAll(bed.setup);

afterAll(bed.teardown);

beforeEach(async () => {
  await bed.clear();
  engine.installPackages.mockReset().mockResolvedValue(undefined);
  engine.resolvePackages.mockReset().mockImplementation(resolveLike);
  engine.readRuntime.mockReset().mockResolvedValue(bed.bed.runtime);
  engine.readOptionsSchema.mockReset().mockResolvedValue(loaded());
});

describe('consent to the packages of a world', () => {
  test('is required for the whole resolved set, and nothing is installed without it', async () => {
    await expect(commitInstall(await bed.jobOf('foo>=1\n'))).rejects.toThrow(
      `${GAME} needs the Python packages foo==1.0, dep-one==2.1.3. Nothing is installed into the engine until you accept.`,
    );
    expect(engine.resolvePackages).toHaveBeenCalledWith(bed.bed.runtime, ['foo>=1']);
    expect(engine.installPackages).not.toHaveBeenCalled();
    expect(engine.readOptionsSchema).not.toHaveBeenCalled();
    expect(await bed.placed()).toBe(false);
  });

  test('MEDIUM 2: installs exactly the accepted resolved pins, indirect ones too, then loads the world, and records them', async () => {
    const order: string[] = [];
    engine.resolvePackages.mockImplementation(() => { order.push('resolve'); return Promise.resolve(RESOLVED); });
    engine.installPackages.mockImplementation(() => { order.push('pip'); return Promise.resolve(); });
    engine.readOptionsSchema.mockImplementation(() => { order.push('load'); return Promise.resolve(loaded()); });
    const record = await commitInstall(await bed.jobOf('foo>=1\n', { packages: consentOf() }));
    expect(engine.installPackages).toHaveBeenCalledWith(bed.bed.runtime, ['foo==1.0', 'dep-one==2.1.3']);
    expect(order).toEqual(['resolve', 'pip', 'load']);
    expect(record.packages).toEqual(['foo==1.0', 'dep-one==2.1.3']);
    expect(await bed.placed()).toBe(true);
  });

  test('MEDIUM 1: consent given for another apworld file is refused', async () => {
    await expect(commitInstall(await bed.jobOf('foo>=1\n', { packages: consentOf({ sha256: 'other' }) }))).rejects.toThrow(
      `${GAME} or its packages changed since you reviewed them. Nothing was installed.`,
    );
    expect(engine.installPackages).not.toHaveBeenCalled();
    expect(await bed.placed()).toBe(false);
  });

  test('MEDIUM 1: consent given to a different resolved set is refused, a new indirect dependency included', async () => {
    const wider = RESOLVED.concat([{ name: 'evil', version: '9', pin: 'evil==9', url: '', direct: false }]);
    engine.resolvePackages.mockResolvedValue(wider);
    await expect(commitInstall(await bed.jobOf('foo>=1\n', { packages: consentOf() }))).rejects.toThrow('changed since you reviewed them');
    engine.resolvePackages.mockResolvedValue(RESOLVED);
    await expect(commitInstall(await bed.jobOf('foo>=1\n', { packages: consentOf({ packages: ['foo==1.0'] }) }))).rejects.toThrow('changed since you reviewed them');
    await expect(commitInstall(await bed.jobOf('foo>=1\n', { packages: consentOf({ packages: ['foo==0.9', 'dep-one==2.1.3'] }) }))).rejects.toThrow('changed since you reviewed them');
    expect(engine.installPackages).not.toHaveBeenCalled();
  });

  test('a world that resolves to nothing new needs no consent', async () => {
    engine.resolvePackages.mockResolvedValue([]);
    const record = await commitInstall(await bed.jobOf('numpy\n'));
    expect(engine.installPackages).not.toHaveBeenCalled();
    expect(record.packages).toBeUndefined();
  });

  test('official worlds are not gated or installed: the engine build installed their requirements', async () => {
    await commitInstall(await bed.jobOf('foo==1.0\n', { source: 'official' }));
    expect(engine.resolvePackages).toHaveBeenCalledWith(bed.bed.runtime, []);
    expect(engine.installPackages).not.toHaveBeenCalled();
  });
});

describe('packages that cannot be installed', () => {
  test('a failed pip run says which packages and why, and places nothing', async () => {
    engine.installPackages.mockRejectedValue(new Error('No matching distribution found for foo'));
    await expect(commitInstall(await bed.jobOf('foo>=1\n', { packages: consentOf() }))).rejects.toThrow(
      `${GAME} needs the Python packages foo, dep-one, which could not be installed: No matching distribution found for foo.`,
    );
    expect(engine.readOptionsSchema).not.toHaveBeenCalled();
    expect(await bed.placed()).toBe(false);
  });

  test('a requirement pip cannot resolve is reported with the declared names', async () => {
    engine.resolvePackages.mockRejectedValue(new Error('No matching distribution found for ctrando'));
    await expect(commitInstall(await bed.jobOf('ctrando>=1\n'))).rejects.toThrow(
      `${GAME} needs the Python package ctrando, which could not be installed: No matching distribution found for ctrando.`,
    );
    expect(engine.installPackages).not.toHaveBeenCalled();
  });

  test('a requirement that is an option, a marker trick or a wheel name is refused by name before pip runs', async () => {
    await expect(commitInstall(await bed.jobOf('--index-url https://evil.example/simple\nfoo\n', { packages: consentOf() }))).rejects.toThrow(
      `${GAME} lists a requirement Archipelia will not install: --index-url https://evil.example/simple.`,
    );
    await expect(commitInstall(await bed.jobOf('foo; --hash=sha256:abc\n'))).rejects.toThrow('will not install: foo; --hash=sha256:abc');
    await expect(commitInstall(await bed.jobOf('evil.whl\n'))).rejects.toThrow('will not install: evil.whl');
    expect(engine.resolvePackages).not.toHaveBeenCalled();
    expect(engine.installPackages).not.toHaveBeenCalled();
  });
});

describe('the preview and the install see the same apworld', () => {
  test('LOW 7: the preview lists every package with its normalized name, version and pypi link, and the file hash', async () => {
    const file = await bed.worldFile('Foo_Bar>=1\n');
    const preview = await previewFilePackages(bed.bed.base, file);
    expect(preview.sha256).toBe(createHash('sha256').update(await readFile(file)).digest('hex'));
    expect(preview.packages.map((found) => [found.pin, found.url])).toEqual([
      ['foo==1.0', 'https://pypi.org/project/foo/1.0/'], ['dep-one==2.1.3', 'https://pypi.org/project/dep-one/2.1.3/'],
    ]);
    expect(engine.resolvePackages).toHaveBeenCalledWith(bed.bed.runtime, ['Foo_Bar>=1']);
  });

  test('what the preview returned is accepted by the install of the same file, and refused for a changed file', async () => {
    const file = await bed.worldFile('foo>=1\n');
    const { sha256, packages } = await previewFilePackages(bed.bed.base, file);
    const accepted = { sha256, packages: packages.map((found) => found.pin) };
    const record = await installFromFile({ engineDir: bed.bed.base, files: bed.files(), path: file, packages: accepted });
    expect(record.packages).toEqual(['foo==1.0', 'dep-one==2.1.3']);
    await bed.clear();
    const changed = await bed.worldFile('foo>=1\n# a later release\n');
    await expect(installFromFile({ engineDir: bed.bed.base, files: bed.files(), path: changed, packages: accepted })).rejects.toThrow(
      'changed since you reviewed them',
    );
  });
});
