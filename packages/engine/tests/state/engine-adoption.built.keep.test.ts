/* @layer tests @kind test */
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { afterEach, describe, expect, test } from 'vitest';
import { readEngineState } from '../../src';
import { ADOPT_OPTIONS } from './adopt-options.fixtures';
import { builtManifest, LEGACY_MANIFEST } from './manifests.fixtures';
import { cleanTempRoots, tempRoot, writeEngineFolder } from './temp-root';

afterEach(cleanTempRoots);

describe('adopting engines the new build wrote', () => {
  test('an engine built by the new build is adopted as it is and the default Archipelago wins', async () => {
    const root = await tempRoot();
    await writeEngineFolder(root, 'ap-0.6.8_py-3.12.15_win32-x64', builtManifest('0.6.8', '3.12.15'));
    await writeEngineFolder(root, 'ap-0.6.7_py-3.12.14_win32-x64', builtManifest('0.6.7', '3.12.14'));
    const state = await readEngineState(root, ADOPT_OPTIONS);
    expect(state.active).toBe('ap-0.6.7_py-3.12.14_win32-x64');
    expect(state.installed.map((engine) => engine.id)).toEqual(['ap-0.6.8_py-3.12.15_win32-x64', 'ap-0.6.7_py-3.12.14_win32-x64']);
  });

  test('a legacy folder for another platform is left alone', async () => {
    const root = await tempRoot();
    await writeEngineFolder(root, '0.6.7-linux-x64', LEGACY_MANIFEST);
    expect((await readEngineState(root, ADOPT_OPTIONS)).installed).toEqual([]);
  });

  test('a damaged state file is rebuilt from the folders', async () => {
    const root = await tempRoot();
    await writeEngineFolder(root, 'ap-0.6.7_py-3.12.14_win32-x64', builtManifest('0.6.7', '3.12.14'));
    await writeEngineFolder(root, 'ap-0.6.8_py-3.12.15_win32-x64', builtManifest('0.6.8', '3.12.15'));
    await writeFile(join(root, 'engines.json'), '{ broken', 'utf8');
    expect((await readEngineState(root, ADOPT_OPTIONS)).installed).toHaveLength(2);
  });
});
