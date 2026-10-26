/* @layer tests @kind test */
import { writeFile } from 'node:fs/promises';
import { describe, expect, test, vi } from 'vitest';
import { consentOf, engine, GAME, loaded, RESOLVED, registerBed } from './world-packages.fixtures';
import { cacheWheel, WHEEL, wheelBytes } from './wheel.fixtures';

vi.mock('@archipelia/engine', async () => (await import('./world-packages.fixtures')).mockedEngine());

const [{ wheelIdsOf }, { previewFilePackages }, { installFromFile }, { commitInstall }] = await Promise.all([
  import('../src/wheel/wheel-ids-of'),
  import('../src/install/preview-file-packages'),
  import('../src/install/install-from-file'),
  import('../src/install/commit-install'),
]);

const bed = registerBed();

const BYTES = wheelBytes({ requires: ['numpy==2.5.1', 'pytest>=8; extra == "test"'] });

const LABEL = { repo: 'Pseudoarc/ctrando', tag: 'v1.2.0', asset: WHEEL, verified: true };

const sourceOf = (sha256: string, patch: object = {}) => ({ ...LABEL, sha256, name: 'ctrando', version: '1.2.0', ...patch });

const stocked = async () => {
  const cached = await cacheWheel(bed.bed.runtime, BYTES, LABEL);
  return { ...cached, source: sourceOf(cached.sha256) };
};

const accepted = (source: object) => consentOf({ sources: [source] });

describe('consent to a ready-made build', () => {
  test('is required, names the wheel with its release and repo, and nothing is installed without it', async () => {
    const { sha256 } = await stocked();
    await expect(commitInstall(await bed.jobOf('', { wheels: [sha256] }))).rejects.toThrow(
      `${GAME} needs the Python packages ctrando 1.2.0 (GitHub release v1.2.0 of Pseudoarc/ctrando), foo==1.0, dep-one==2.1.3. Nothing is installed into the engine until you accept.`,
    );
    expect(engine.installWheel).not.toHaveBeenCalled();
    expect(engine.installPackages).not.toHaveBeenCalled();
    expect(engine.readOptionsSchema).not.toHaveBeenCalled();
    expect(await bed.placed()).toBe(false);
  });

  test('sends the dependencies of the wheel with the requirements of the world through the same resolve, and leaves extras out', async () => {
    const { sha256, source } = await stocked();
    await commitInstall(await bed.jobOf('foo>=1\n', { wheels: [sha256], packages: accepted(source) }));
    expect(engine.resolvePackages).toHaveBeenCalledWith(bed.bed.runtime, ['foo>=1', 'numpy==2.5.1']);
  });

  test('a requirement of the world that the wheel provides is not sent to the Python Package Index', async () => {
    const { sha256, source } = await stocked();
    await commitInstall(await bed.jobOf('Foo>=1\nCTRando>=1.0\n', { wheels: [sha256], packages: accepted(source) }));
    expect(engine.resolvePackages).toHaveBeenCalledWith(bed.bed.runtime, ['Foo>=1', 'numpy==2.5.1']);
  });

  test('installs the accepted pins first, then exactly that wheel by its hash, then loads the world, and records the source', async () => {
    const order: string[] = [];
    const { sha256, file, source } = await stocked();
    engine.installPackages.mockImplementation(() => { order.push('pip'); return Promise.resolve(); });
    engine.installWheel.mockImplementation(() => { order.push('wheel'); return Promise.resolve(); });
    engine.readOptionsSchema.mockImplementation(() => { order.push('load'); return Promise.resolve(loaded()); });
    const record = await commitInstall(await bed.jobOf('', { wheels: [sha256], packages: accepted(source) }));
    expect(order).toEqual(['pip', 'wheel', 'load']);
    expect(engine.installWheel).toHaveBeenCalledWith(bed.bed.runtime, { file, sha256 });
    expect(record.sources).toEqual([source]);
    expect(record.packages).toEqual(['foo==1.0', 'dep-one==2.1.3']);
    expect(await bed.placed()).toBe(true);
  });

  test('a wheel with nothing else to install still asks, and is recorded without a pin list', async () => {
    engine.resolvePackages.mockResolvedValue([]);
    const { sha256, source } = await stocked();
    await expect(commitInstall(await bed.jobOf('', { wheels: [sha256] }))).rejects.toThrow('Nothing is installed into the engine until you accept');
    const record = await commitInstall(await bed.jobOf('', { wheels: [sha256], packages: consentOf({ packages: [], sources: [source] }) }));
    expect(record.sources).toEqual([source]);
    expect(record.packages).toBeUndefined();
  });
});

describe('what the consent is bound to', () => {
  test('a consent for another wheel, release, repo or digest is refused', async () => {
    const { sha256, source } = await stocked();
    const refused = [
      sourceOf('f'.repeat(64)), sourceOf(sha256, { tag: 'v9.9.9' }), sourceOf(sha256, { repo: 'evil/ctrando' }), sourceOf(sha256, { asset: 'other-1-py3-none-any.whl' }),
      sourceOf(sha256, { verified: false }), sourceOf(sha256, { version: '9.9.9' }),
    ];
    for (const other of refused) {
      await expect(commitInstall(await bed.jobOf('', { wheels: [sha256], packages: accepted(other) }))).rejects.toThrow('changed since you reviewed them');
    }
    expect(source.sha256).toBe(sha256);
    expect(engine.installWheel).not.toHaveBeenCalled();
    expect(engine.installPackages).not.toHaveBeenCalled();
  });

  test('a consent with no source, with an extra source, or from a world that asked for no wheel is refused', async () => {
    const { sha256, source } = await stocked();
    await expect(commitInstall(await bed.jobOf('', { wheels: [sha256], packages: consentOf() }))).rejects.toThrow('changed since you reviewed them');
    await expect(commitInstall(await bed.jobOf('', { wheels: [sha256], packages: consentOf({ sources: [source, sourceOf('e'.repeat(64))] }) }))).rejects.toThrow('changed');
    await expect(commitInstall(await bed.jobOf('foo>=1\n', { packages: accepted(source) }))).rejects.toThrow('changed since you reviewed them');
    expect(engine.installWheel).not.toHaveBeenCalled();
  });

  test('the consent still has to match the file of the world and the resolved pins', async () => {
    const { sha256, source } = await stocked();
    await expect(commitInstall(await bed.jobOf('', { wheels: [sha256], packages: consentOf({ sha256: 'other', sources: [source] }) }))).rejects.toThrow('changed');
    await expect(commitInstall(await bed.jobOf('', { wheels: [sha256], packages: consentOf({ packages: ['foo==1.0'], sources: [source] }) }))).rejects.toThrow('changed');
  });

  test('a wheel that changed on disk after it was reviewed, or is gone, stops the install', async () => {
    const { sha256, file, source } = await stocked();
    await writeFile(file, 'tampered');
    await expect(commitInstall(await bed.jobOf('', { wheels: [sha256], packages: accepted(source) }))).rejects.toThrow('changed on disk');
    await expect(commitInstall(await bed.jobOf('', { wheels: ['c'.repeat(64)], packages: accepted(source) }))).rejects.toThrow('no longer there');
    expect(engine.installWheel).not.toHaveBeenCalled();
    expect(await bed.placed()).toBe(false);
  });

  test('a failed wheel install names the wheel and places nothing', async () => {
    const { sha256, source } = await stocked();
    engine.installWheel.mockRejectedValue(new Error('THESE PACKAGES DO NOT MATCH THE HASHES'));
    await expect(commitInstall(await bed.jobOf('', { wheels: [sha256], packages: accepted(source) }))).rejects.toThrow(
      `${GAME} needs the Python package ctrando, which could not be installed: THESE PACKAGES DO NOT MATCH THE HASHES.`,
    );
    expect(await bed.placed()).toBe(false);
    expect(engine.readOptionsSchema).not.toHaveBeenCalled();
  });

  test('official worlds ignore wheels, and a wheel list that is not sha256 ids is not valid', async () => {
    await commitInstall(await bed.jobOf('foo==1.0\n', { source: 'official', wheels: ['d'.repeat(64)] }));
    expect(engine.installWheel).not.toHaveBeenCalled();
    expect(wheelIdsOf(undefined)).toEqual([]);
    for (const bad of [['../x'], 'abc', [5], Array.from({ length: 9 }, () => 'a'.repeat(64))]) expect(() => wheelIdsOf(bad)).toThrow('not valid');
  });
});

describe('the preview and the install see the same wheel', () => {
  test('lists the wheel as a source, resolves its dependencies, and what it returned is accepted by the install of the same file', async () => {
    const { sha256, source } = await stocked();
    const file = await bed.worldFile('');
    const preview = await previewFilePackages(bed.bed.base, file, [sha256]);
    expect(preview.sources).toEqual([source]);
    expect(preview.packages.map((found) => found.pin)).toEqual(RESOLVED.map((found) => found.pin));
    expect(engine.resolvePackages).toHaveBeenCalledWith(bed.bed.runtime, ['numpy==2.5.1']);
    const consent = { sha256: preview.sha256, packages: preview.packages.map((found) => found.pin), sources: preview.sources ?? [] };
    const record = await installFromFile({ engineDir: bed.bed.base, files: bed.files(), path: file, packages: consent, wheels: [sha256] });
    expect(record.sources).toEqual([source]);
  });

  test('a preview with no wheel has no sources', async () => {
    const preview = await previewFilePackages(bed.bed.base, await bed.worldFile('foo>=1\n'));
    expect(preview.sources).toBeUndefined();
  });
});
