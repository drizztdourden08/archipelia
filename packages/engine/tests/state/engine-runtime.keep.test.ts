/* @layer tests @kind test */
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { afterEach, describe, expect, test } from 'vitest';
import {
  activateEngine, activeEngineDir, createEngineSpec, ENGINE_DIR_ENV, loadActiveRuntime, loadEngineRuntime, readActiveEngineStatus,
  readEngineMeta, readInstalledEngine, readRuntime, registerEngine, stampEngineSmoke, verifyEngineSource,
} from '../../src';
import { MODULE_UPDATE_0_6_8 } from '../versions/fixtures/module-update.fixtures';
import { builtManifest, LEGACY_MANIFEST } from './manifests.fixtures';
import { cleanTempRoots, tempRoot, writeEngineFolder } from './temp-root';

const python = (version: string) => ({
  version,
  release: '20261021',
  target: 'win32-x64',
  file: `cpython-${version}+20261021-x86_64-pc-windows-msvc-install_only.tar.gz`,
  sha256: 'c'.repeat(64),
});

afterEach(cleanTempRoots);

describe('the runtime of a built engine', () => {
  test('reads the id, commit and Python version the build wrote', async () => {
    const root = await tempRoot();
    const dir = await writeEngineFolder(root, 'ap-0.6.8_py-3.12.15_win32-x64', builtManifest('0.6.8', '3.12.15'));
    expect(await readRuntime(dir)).toMatchObject({ id: 'ap-0.6.8_py-3.12.15_win32-x64', apCommit: 'a'.repeat(40), pythonVersion: '3.12.15' });
  });

  test('a manifest without the new fields is refused', async () => {
    const root = await tempRoot();
    const dir = await writeEngineFolder(root, 'old', LEGACY_MANIFEST);
    await expect(readRuntime(dir)).rejects.toThrow('expected shape');
  });

  test('the installed entry and the meta come from the same manifest', async () => {
    const root = await tempRoot();
    const dir = await writeEngineFolder(root, 'ap-0.6.8_py-3.12.15_win32-x64', builtManifest('0.6.8', '3.12.15'));
    expect(await readInstalledEngine(dir)).toMatchObject({ ap: '0.6.8', python: '3.12.15', pythonRelease: '20261021', target: 'win32-x64', state: 'ready' });
    expect(await readEngineMeta(dir)).toMatchObject({ packages: ['requests==2.32.5'], rules: [{ skip: ['kivy'], extra: [] }] });
  });

  test('the smoke result is stamped into the manifest and read back', async () => {
    const root = await tempRoot();
    const dir = await writeEngineFolder(root, 'ap-0.6.8_py-3.12.15_win32-x64', builtManifest('0.6.8', '3.12.15'));
    await stampEngineSmoke(dir, { ok: true, at: 5, warnings: ['coarse progress'] });
    expect((await readEngineMeta(dir)).smoke).toEqual({ ok: true, at: 5, warnings: ['coarse progress'] });
    expect((await readInstalledEngine(dir)).smoke?.ok).toBe(true);
    expect(await readRuntime(dir)).toMatchObject({ apVersion: '0.6.8' });
  });
});

describe('finding the active engine', () => {
  test('no active engine reads as missing and refuses to load', async () => {
    const root = await tempRoot();
    expect(await readActiveEngineStatus(root)).toEqual({ state: 'missing', dir: root });
    await expect(loadActiveRuntime(root)).rejects.toThrow('not set up');
  });

  test('the active engine loads, and so does any engine by id', async () => {
    const root = await tempRoot();
    const first = await writeEngineFolder(root, 'ap-0.6.7_py-3.12.14_win32-x64', builtManifest('0.6.7', '3.12.14'));
    await writeEngineFolder(root, 'ap-0.6.8_py-3.12.15_win32-x64', builtManifest('0.6.8', '3.12.15'));
    await registerEngine(root, await readInstalledEngine(first));
    await activateEngine(root, 'ap-0.6.7_py-3.12.14_win32-x64');
    expect((await loadActiveRuntime(root)).apVersion).toBe('0.6.7');
    expect((await loadEngineRuntime(root, 'ap-0.6.8_py-3.12.15_win32-x64')).apVersion).toBe('0.6.8');
    expect(await readActiveEngineStatus(root)).toMatchObject({ state: 'ready', id: 'ap-0.6.7_py-3.12.14_win32-x64', pythonVersion: '3.12.14' });
  });

  test('the engine folder variable overrides the state', async () => {
    const root = await tempRoot();
    process.env[ENGINE_DIR_ENV] = join(root, 'elsewhere');
    try {
      expect(await activeEngineDir(root)).toBe(join(root, 'elsewhere'));
    } finally {
      delete process.env[ENGINE_DIR_ENV];
    }
  });
});

describe('engine specs', () => {
  test('a spec names its folder and applies the requirement rules for its versions', () => {
    const spec = createEngineSpec({ ap: { version: '0.6.8', commit: 'd'.repeat(40) }, python: python('3.12.15') });
    expect(spec.id).toBe('ap-0.6.8_py-3.12.15_win32-x64');
    expect(spec.requirements.skip).toEqual(['kivy', 'kivymd', 'pyshortcuts']);
    expect(spec.requirements.extra).toEqual(['requests==2.32.5', 'setuptools==80.9.0']);
    expect(spec.python).toEqual({ version: '3.12.15', release: '20261021', file: python('3.12.15').file, sha256: 'c'.repeat(64) });
  });

  test('an older Python gets no setuptools pin', () => {
    const spec = createEngineSpec({ ap: { version: '0.6.8', commit: 'd'.repeat(40) }, python: python('3.11.17') });
    expect(spec.requirements.extra).toEqual(['requests==2.32.5']);
  });
});

describe('verifying the unpacked source', () => {
  test('a Python inside the declared range passes', async () => {
    const root = await tempRoot();
    await writeFile(join(root, 'ModuleUpdate.py'), MODULE_UPDATE_0_6_8, 'utf8');
    const spec = createEngineSpec({ ap: { version: '0.6.8', commit: 'd'.repeat(40) }, python: python('3.12.15') });
    expect(await verifyEngineSource(root, spec, 'win32')).toBeUndefined();
  });

  test('a Python outside the range names the range', async () => {
    const root = await tempRoot();
    await writeFile(join(root, 'ModuleUpdate.py'), MODULE_UPDATE_0_6_8, 'utf8');
    const spec = createEngineSpec({ ap: { version: '0.6.8', commit: 'd'.repeat(40) }, python: python('3.14.9') });
    await expect(verifyEngineSource(root, spec, 'win32')).rejects.toThrow('Archipelago 0.6.8 needs');
  });

  test('a Python under the warning line passes with the warning text', async () => {
    const root = await tempRoot();
    await writeFile(join(root, 'ModuleUpdate.py'), MODULE_UPDATE_0_6_8, 'utf8');
    const spec = createEngineSpec({ ap: { version: '0.6.8', commit: 'd'.repeat(40) }, python: python('3.11.10') });
    expect(await verifyEngineSource(root, spec, 'win32')).toContain('security');
  });

  test('a missing ModuleUpdate.py falls back to the defaults range', async () => {
    const root = await tempRoot();
    const spec = createEngineSpec({ ap: { version: '0.6.8', commit: 'd'.repeat(40) }, python: python('3.12.15') });
    expect(await verifyEngineSource(root, spec, 'win32')).toBeUndefined();
  });
});
