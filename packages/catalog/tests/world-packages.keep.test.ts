/* @layer tests @kind test */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, expect, test, vi } from 'vitest';
import type { EngineRuntime } from '@archipelia/model';
import { recordOf } from './memory-files.fixtures';
import { engine, GAME, MISSING, notLoaded, registerBed } from './world-packages.fixtures';

vi.mock('@archipelia/engine', async () => (await import('./world-packages.fixtures')).mockedEngine());

const { commitInstall } = await import('../src/install/commit-install');
const { readApworld } = await import('../src/install/read-apworld');
const { copyPlacedWorld } = await import('../src/install/copy-placed-world');

const bed = registerBed();

describe('reading the requirements of an apworld', () => {
  test('K1 reads requirements.txt from the world folder, and nothing nested deeper', { tags: ['critical'] }, async () => {
    const file = await bed.write('deep.apworld', { 'deep/__init__.py': '', 'deep/requirements.txt': 'numpy==2\n', 'deep/lib/requirements.txt': 'evil==1' });
    expect((await readApworld(file)).requirements).toBe('numpy==2\n');
  });

  test('K1 a world without a requirements file reads none', { tags: ['critical'] }, async () => {
    expect((await readApworld(await bed.write('plain.apworld', { 'plain/__init__.py': '' }))).requirements).toBe('');
  });
});

describe('a world that needs a package it does not declare', () => {
  test('S3 without a requirements file the message names the package and why it was not installed', { tags: ['standard'] }, async () => {
    engine.readOptionsSchema.mockResolvedValue(notLoaded(MISSING));
    await expect(commitInstall(await bed.jobOf(undefined))).rejects.toThrow(
      `${GAME} needs the Python package ctrando, which could not be installed: the world does not list it in a requirements.txt.`,
    );
    expect(engine.installPackages).not.toHaveBeenCalled();
    expect(await bed.placed()).toBe(false);
  });

  test('S3 a requirements file that does not provide it says so', { tags: ['standard'] }, async () => {
    engine.resolvePackages.mockResolvedValue([]);
    engine.readOptionsSchema.mockResolvedValue(notLoaded(MISSING));
    await expect(commitInstall(await bed.jobOf('numpy\n'))).rejects.toThrow(
      `${GAME} needs the Python package ctrando, which could not be installed: the world's requirements.txt (numpy) does not provide it.`,
    );
  });

  test('S3 a missing module of the world itself is not blamed on a package', { tags: ['standard'] }, async () => {
    engine.readOptionsSchema.mockResolvedValue(notLoaded(["ModuleNotFoundError: No module named 'worlds.ctrdi.nothing'"]));
    await expect(commitInstall(await bed.jobOf(undefined))).rejects.toThrow(
      `${GAME}: failed to load: ctrdi (ModuleNotFoundError: No module named 'worlds.ctrdi.nothing')`,
    );
  });

  test('S3 a world without a manifest name gets the same message when the game cannot be detected', { tags: ['standard'] }, async () => {
    engine.readOptionsSchema.mockResolvedValue(notLoaded(MISSING));
    await expect(commitInstall(await bed.jobOf(undefined, { game: undefined }))).rejects.toThrow(
      'ctrdi needs the Python package ctrando, which could not be installed: the world does not list it in a requirements.txt.',
    );
  });
});

describe('a world without a requirements file', () => {
  test('S2 installs exactly as before: no pip install, no packages recorded', { tags: ['standard'] }, async () => {
    const record = await commitInstall(await bed.jobOf(undefined));
    expect(engine.installPackages).not.toHaveBeenCalled();
    expect(record.packages).toBeUndefined();
    expect(await readFile(bed.target()).then((bytes) => bytes.length > 0)).toBe(true);
  });
});

describe('carrying a world to another engine', () => {
  test('K3 LOW 3: installs the recorded resolved pins into that engine, without resolving again', { tags: ['critical'] }, async () => {
    const to: EngineRuntime = { ...bed.bed.runtime, id: 'next', root: join(bed.bed.base, 'next') };
    await mkdir(join(to.root, 'ap', 'custom_worlds'), { recursive: true });
    await writeFile(bed.target(), 'x');
    const record = recordOf('ctrdi', { game: GAME, source: 'index', path: 'custom_worlds/ctrdi.apworld', packages: ['foo==1.0', 'dep-one==2.1.3'] });
    await copyPlacedWorld({ from: bed.bed.runtime, to, record });
    expect(engine.installPackages).toHaveBeenCalledWith(to, ['foo==1.0', 'dep-one==2.1.3']);
    expect(engine.resolvePackages).not.toHaveBeenCalled();
    engine.installPackages.mockRejectedValue(new Error('No matching distribution found for foo'));
    await expect(copyPlacedWorld({ from: bed.bed.runtime, to, record })).rejects.toThrow(
      `${GAME} needs the Python packages foo, dep-one, which could not be installed: No matching distribution found for foo.`,
    );
  });
});
