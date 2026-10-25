/* @layer tests @kind test */
import { mkdir, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { strToU8, zipSync } from 'fflate';
import { afterAll, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import type { EngineRuntime } from '@archipelia/model';
import { memoryFiles, recordOf } from './memory-files.fixtures';

const engine = vi.hoisted(() => ({ installPackages: vi.fn(), readOptionsSchema: vi.fn() }));

vi.mock('@archipelia/engine', async (original) => ({ ...(await original<object>()), ...engine }));

const { commitInstall } = await import('../src/install/commit-install');
const { readApworld } = await import('../src/install/read-apworld');
const { copyPlacedWorld } = await import('../src/install/copy-placed-world');

const GAME = 'Chrono Trigger Rando-Dalton Imperial';

let base = '';
let runtime: EngineRuntime;

const write = async (name: string, entries: Record<string, string>) => {
  const file = join(base, name);
  await writeFile(file, zipSync(Object.fromEntries(Object.entries(entries).map(([k, v]) => [k, strToU8(v)]))));
  return file;
};

const worldFile = (requirements?: string) => write('ctrdi.apworld', {
  'ctrdi/__init__.py': '', 'ctrdi/archipelago.json': `{"game":"${GAME}"}`, ...(requirements === undefined ? {} : { 'ctrdi/requirements.txt': requirements }),
});

const loaded = () => ({
  schemas: { [GAME]: { game: GAME, worldVersion: '1', groups: [], options: [], presets: {}, unsupported: [] } },
  errors: {}, failedWorlds: [], seconds: 1, lines: [],
});

const notLoaded = (lines: string[]) => ({ schemas: {}, errors: {}, failedWorlds: ['ctrdi'], seconds: 1, lines });

const MISSING = ["Traceback (most recent call last):", "ModuleNotFoundError: No module named 'ctrando'"];

const jobOf = async (requirements: string | undefined, patch: object = {}) => {
  const file = await worldFile(requirements);
  return {
    runtime, files: memoryFiles([]), file, info: await readApworld(file), apworld: 'ctrdi', game: GAME, source: 'index' as const,
    layout: 'apworld' as const, hash: { sha256: 'abc', verified: true }, requires: [], ...patch,
  };
};

beforeAll(async () => {
  base = await mkdtemp(join(tmpdir(), 'archipelia-world-packages-'));
  runtime = {
    id: 'e', apVersion: '0.6.7', apCommit: '', pythonVersion: '3.12', root: join(base, 'engine'),
    python: 'python', generate: '', multiServer: '', schemaScript: '',
  };
  await mkdir(join(runtime.root, 'ap', 'custom_worlds'), { recursive: true });
});

afterAll(() => rm(base, { recursive: true, force: true }));

beforeEach(async () => {
  await rm(join(runtime.root, 'ap', 'custom_worlds', 'ctrdi.apworld'), { force: true });
  engine.installPackages.mockReset().mockResolvedValue(undefined);
  engine.readOptionsSchema.mockReset().mockResolvedValue(loaded());
});

const placed = () => stat(join(runtime.root, 'ap', 'custom_worlds', 'ctrdi.apworld')).then(() => true, () => false);

describe('reading the requirements of an apworld', () => {
  test('reads requirements.txt from the world folder, and nothing nested deeper', async () => {
    const file = await write('deep.apworld', { 'deep/__init__.py': '', 'deep/requirements.txt': 'numpy==2\n', 'deep/lib/requirements.txt': 'evil==1' });
    expect((await readApworld(file)).requirements).toBe('numpy==2\n');
  });

  test('a world without a requirements file reads none', async () => {
    expect((await readApworld(await write('plain.apworld', { 'plain/__init__.py': '' }))).requirements).toBe('');
  });
});

describe('installing a world that declares requirements', () => {
  test('is refused until the packages are accepted, and touches nothing', async () => {
    await expect(commitInstall(await jobOf('foo==1.0\nbar>=2\n'))).rejects.toThrow(
      `${GAME} needs the Python packages foo==1.0, bar>=2. Nothing is installed into the engine until you accept.`,
    );
    expect(engine.installPackages).not.toHaveBeenCalled();
    expect(engine.readOptionsSchema).not.toHaveBeenCalled();
    expect(await placed()).toBe(false);
  });

  test('installs the accepted packages into the engine, then loads the world, and records them', async () => {
    const order: string[] = [];
    engine.installPackages.mockImplementation(() => { order.push('pip'); return Promise.resolve(); });
    engine.readOptionsSchema.mockImplementation(() => { order.push('load'); return Promise.resolve(loaded()); });
    const record = await commitInstall(await jobOf('foo==1.0\n', { packages: 'any' }));
    expect(engine.installPackages).toHaveBeenCalledWith(runtime, ['foo==1.0']);
    expect(order).toEqual(['pip', 'load']);
    expect(record.packages).toEqual(['foo==1.0']);
    expect(await placed()).toBe(true);
  });

  test('accepting a list covers only those exact packages', async () => {
    await expect(commitInstall(await jobOf('foo==1.0\nbar\n', { packages: ['foo==1.0'] }))).rejects.toThrow('needs the Python packages foo==1.0, bar');
    expect(engine.installPackages).not.toHaveBeenCalled();
  });

  test('a failed pip run says which packages and why, and rolls the world back', async () => {
    engine.installPackages.mockRejectedValue(new Error('No matching distribution found for foo'));
    await expect(commitInstall(await jobOf('foo==1.0\n', { packages: 'any' }))).rejects.toThrow(
      `${GAME} needs the Python package foo, which could not be installed: No matching distribution found for foo.`,
    );
    expect(engine.readOptionsSchema).not.toHaveBeenCalled();
    expect(await placed()).toBe(false);
  });

  test('a requirement that is an option or a url is refused by name', async () => {
    await expect(commitInstall(await jobOf('--index-url https://evil.example/simple\nfoo\n', { packages: 'any' }))).rejects.toThrow(
      `${GAME} lists a requirement Archipelia will not install: --index-url https://evil.example/simple.`,
    );
    expect(engine.installPackages).not.toHaveBeenCalled();
  });

  test('official worlds are not gated: the engine build installed their requirements', async () => {
    await commitInstall(await jobOf('foo==1.0\n', { source: 'official' }));
    expect(engine.installPackages).not.toHaveBeenCalled();
  });
});

describe('a world that needs a package it does not declare', () => {
  test('without a requirements file the message names the package and why it was not installed', async () => {
    engine.readOptionsSchema.mockResolvedValue(notLoaded(MISSING));
    await expect(commitInstall(await jobOf(undefined))).rejects.toThrow(
      `${GAME} needs the Python package ctrando, which could not be installed: the world does not list it in a requirements.txt.`,
    );
    expect(engine.installPackages).not.toHaveBeenCalled();
    expect(await placed()).toBe(false);
  });

  test('a requirements file that does not provide it says so', async () => {
    engine.readOptionsSchema.mockResolvedValue(notLoaded(MISSING));
    await expect(commitInstall(await jobOf('numpy\n', { packages: 'any' }))).rejects.toThrow(
      `${GAME} needs the Python package ctrando, which could not be installed: the world's requirements.txt (numpy) does not provide it.`,
    );
  });

  test('a missing module of the world itself is not blamed on a package', async () => {
    engine.readOptionsSchema.mockResolvedValue(notLoaded(["ModuleNotFoundError: No module named 'worlds.ctrdi.nothing'"]));
    await expect(commitInstall(await jobOf(undefined))).rejects.toThrow(`${GAME}: failed to load: ctrdi (ModuleNotFoundError: No module named 'worlds.ctrdi.nothing')`);
  });

  test('a world without a manifest name gets the same message when the game cannot be detected', async () => {
    engine.readOptionsSchema.mockResolvedValue(notLoaded(MISSING));
    await expect(commitInstall(await jobOf(undefined, { game: undefined }))).rejects.toThrow(
      'ctrdi needs the Python package ctrando, which could not be installed: the world does not list it in a requirements.txt.',
    );
  });
});

describe('a world without a requirements file', () => {
  test('installs exactly as before: no pip, no packages recorded', async () => {
    const record = await commitInstall(await jobOf(undefined));
    expect(engine.installPackages).not.toHaveBeenCalled();
    expect(record.packages).toBeUndefined();
    expect(await readFile(join(runtime.root, 'ap', 'custom_worlds', 'ctrdi.apworld')).then((bytes) => bytes.length > 0)).toBe(true);
  });
});

describe('carrying a world to another engine', () => {
  test('installs the packages the user accepted into that engine too, and says why when it cannot', async () => {
    const to: EngineRuntime = { ...runtime, id: 'next', root: join(base, 'next') };
    await mkdir(join(to.root, 'ap', 'custom_worlds'), { recursive: true });
    await writeFile(join(runtime.root, 'ap', 'custom_worlds', 'ctrdi.apworld'), 'x');
    const record = recordOf('ctrdi', { game: GAME, source: 'index', path: 'custom_worlds/ctrdi.apworld', packages: ['foo==1.0'] });
    await copyPlacedWorld({ from: runtime, to, record });
    expect(engine.installPackages).toHaveBeenCalledWith(to, ['foo==1.0']);
    engine.installPackages.mockRejectedValue(new Error('No matching distribution found for foo'));
    await expect(copyPlacedWorld({ from: runtime, to, record })).rejects.toThrow(
      `${GAME} needs the Python package foo, which could not be installed: No matching distribution found for foo.`,
    );
  });
});
