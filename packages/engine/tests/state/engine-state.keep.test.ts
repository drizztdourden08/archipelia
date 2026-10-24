/* @layer tests @kind test */
import type { InstalledEngine } from '@archipelia/model';
import { afterEach, describe, expect, test } from 'vitest';
import {
  activateEngine, findActiveEngine, findInstalledEngine, forgetEngine, markOffered, readEngineState, registerEngine,
} from '../../src';
import { cleanTempRoots, tempRoot } from './temp-root';

const engine = (ap: string, python: string, state: InstalledEngine['state'] = 'ready'): InstalledEngine => ({
  id: `ap-${ap}_py-${python}_win32-x64`,
  ap,
  apCommit: 'b'.repeat(40),
  python,
  pythonRelease: '20261021',
  target: 'win32-x64',
  builtAt: 1,
  state,
});

afterEach(cleanTempRoots);

describe('engine state', () => {
  test('an empty folder reads as no engine', async () => {
    expect(await readEngineState(await tempRoot())).toEqual({ version: 1, installed: [] });
  });

  test('registering adds an engine and replaces one with the same id', async () => {
    const root = await tempRoot();
    await registerEngine(root, engine('0.6.8', '3.12.15'));
    await registerEngine(root, { ...engine('0.6.8', '3.12.15'), state: 'failed' });
    const state = await readEngineState(root);
    expect(state.installed).toHaveLength(1);
    expect(state.installed[0]?.state).toBe('failed');
  });

  test('switching records the previous engine as the last good one', async () => {
    const root = await tempRoot();
    await registerEngine(root, engine('0.6.7', '3.12.14'));
    await registerEngine(root, engine('0.6.8', '3.12.15'));
    await activateEngine(root, 'ap-0.6.7_py-3.12.14_win32-x64');
    const state = await activateEngine(root, 'ap-0.6.8_py-3.12.15_win32-x64');
    expect(state.active).toBe('ap-0.6.8_py-3.12.15_win32-x64');
    expect(state.lastGood).toBe('ap-0.6.7_py-3.12.14_win32-x64');
    expect(findActiveEngine(state)?.ap).toBe('0.6.8');
  });

  test('a failed or unknown engine cannot be activated', async () => {
    const root = await tempRoot();
    await registerEngine(root, engine('0.6.8', '3.12.15', 'failed'));
    await expect(activateEngine(root, 'ap-0.6.8_py-3.12.15_win32-x64')).rejects.toThrow('did not pass');
    await expect(activateEngine(root, 'nope')).rejects.toThrow('not installed');
  });

  test('the active engine cannot be forgotten and a forgotten last good engine is cleared', async () => {
    const root = await tempRoot();
    await registerEngine(root, engine('0.6.7', '3.12.14'));
    await registerEngine(root, engine('0.6.8', '3.12.15'));
    await activateEngine(root, 'ap-0.6.7_py-3.12.14_win32-x64');
    await activateEngine(root, 'ap-0.6.8_py-3.12.15_win32-x64');
    await expect(forgetEngine(root, 'ap-0.6.8_py-3.12.15_win32-x64')).rejects.toThrow('active');
    const state = await forgetEngine(root, 'ap-0.6.7_py-3.12.14_win32-x64');
    expect(state.lastGood).toBeUndefined();
    expect(state.installed.map((entry) => entry.ap)).toEqual(['0.6.8']);
  });

  test('the offered version is stored', async () => {
    const root = await tempRoot();
    await markOffered(root, '0.6.9');
    expect((await readEngineState(root)).offeredAp).toBe('0.6.9');
  });

  test('parallel updates do not lose an engine', async () => {
    const root = await tempRoot();
    const versions = Array.from({ length: 12 }, (_, index) => `0.6.${index}`);
    await Promise.all(versions.map((ap) => registerEngine(root, engine(ap, '3.12.15'))));
    expect((await readEngineState(root)).installed).toHaveLength(12);
  });

  test('an installed engine is found by its versions and target', async () => {
    const root = await tempRoot();
    const state = await registerEngine(root, engine('0.6.8', '3.12.15'));
    expect(findInstalledEngine(state, '0.6.8', '3.12.15', 'win32-x64')?.id).toBe('ap-0.6.8_py-3.12.15_win32-x64');
    expect(findInstalledEngine(state, '0.6.8', '3.13.17', 'win32-x64')).toBeUndefined();
  });
});
