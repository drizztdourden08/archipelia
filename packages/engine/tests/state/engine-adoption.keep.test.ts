/* @layer tests @kind test */
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { afterEach, describe, expect, test } from 'vitest';
import { ENGINE_DEFAULTS, readEngineState, readRuntime } from '../../src';
import { builtManifest, LEGACY_MANIFEST } from './manifests.fixtures';
import { cleanTempRoots, tempRoot, writeEngineFolder } from './temp-root';

const options = { defaults: ENGINE_DEFAULTS, target: 'win32-x64' };

afterEach(cleanTempRoots);

describe('adopting the legacy engine folder', () => {
  test('a 0.6.7 folder becomes the active engine under its new id without a download', async () => {
    const root = await tempRoot();
    await writeEngineFolder(root, '0.6.7-win32-x64', LEGACY_MANIFEST);
    const state = await readEngineState(root, options);
    expect(state.active).toBe('ap-0.6.7_py-3.12.14_win32-x64');
    expect(state.lastGood).toBe(state.active);
    expect(state.installed).toHaveLength(1);
    expect(state.installed[0]).toMatchObject({
      ap: '0.6.7',
      apCommit: ENGINE_DEFAULTS.defaultAp.commit,
      python: '3.12.14',
      pythonRelease: '20260924',
      target: 'win32-x64',
      state: 'ready',
    });
    expect(await readdir(root)).toEqual(expect.arrayContaining(['ap-0.6.7_py-3.12.14_win32-x64', 'engines.json']));
    expect(await readdir(root)).not.toContain('0.6.7-win32-x64');
  });

  test('the adopted manifest now carries the fields the build writes', async () => {
    const root = await tempRoot();
    await writeEngineFolder(root, '0.6.7-win32-x64', LEGACY_MANIFEST);
    await readEngineState(root, options);
    const runtime = await readRuntime(join(root, 'ap-0.6.7_py-3.12.14_win32-x64'));
    expect(runtime).toMatchObject({ id: 'ap-0.6.7_py-3.12.14_win32-x64', apVersion: '0.6.7', pythonVersion: '3.12.14' });
  });

  test('a second read keeps the state and does not adopt again', async () => {
    const root = await tempRoot();
    await writeEngineFolder(root, '0.6.7-win32-x64', LEGACY_MANIFEST);
    const first = await readEngineState(root, options);
    const second = await readEngineState(root, options);
    expect(second).toEqual(first);
    expect(JSON.parse(await readFile(join(root, 'engines.json'), 'utf8'))).toEqual(first);
  });

  test('the downloads folder and folders without a manifest are ignored', async () => {
    const root = await tempRoot();
    await writeEngineFolder(root, 'downloads', LEGACY_MANIFEST);
    const state = await readEngineState(root, options);
    expect(state).toEqual({ version: 1, installed: [] });
    expect(await readdir(root)).not.toContain('engines.json');
  });

  test('an engine built by the new build is adopted as it is and the default Archipelago wins', async () => {
    const root = await tempRoot();
    await writeEngineFolder(root, 'ap-0.6.8_py-3.12.15_win32-x64', builtManifest('0.6.8', '3.12.15'));
    await writeEngineFolder(root, 'ap-0.6.7_py-3.12.14_win32-x64', builtManifest('0.6.7', '3.12.14'));
    const state = await readEngineState(root, options);
    expect(state.active).toBe('ap-0.6.7_py-3.12.14_win32-x64');
    expect(state.installed.map((engine) => engine.id)).toEqual(['ap-0.6.8_py-3.12.15_win32-x64', 'ap-0.6.7_py-3.12.14_win32-x64']);
  });

  test('a legacy folder for another platform is left alone', async () => {
    const root = await tempRoot();
    await writeEngineFolder(root, '0.6.7-linux-x64', LEGACY_MANIFEST);
    expect((await readEngineState(root, options)).installed).toEqual([]);
  });

  test('a damaged state file is rebuilt from the folders', async () => {
    const root = await tempRoot();
    await writeEngineFolder(root, 'ap-0.6.7_py-3.12.14_win32-x64', builtManifest('0.6.7', '3.12.14'));
    await writeEngineFolder(root, 'ap-0.6.8_py-3.12.15_win32-x64', builtManifest('0.6.8', '3.12.15'));
    await writeFile(join(root, 'engines.json'), '{ broken', 'utf8');
    expect((await readEngineState(root, options)).installed).toHaveLength(2);
  });
});
