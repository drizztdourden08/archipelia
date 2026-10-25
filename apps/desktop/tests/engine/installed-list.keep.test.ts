/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { brokenWorldsConfirm } from '../../src/views/EngineSettings/behavior/broken-worlds-confirm';
import { engineTags } from '../../src/views/EngineSettings/behavior/engine-tags';
import { installedMeta } from '../../src/views/EngineSettings/behavior/installed-meta';
import { installFailure } from '../../src/views/EngineSettings/behavior/install-failure';
import { removeEngineConfirm } from '../../src/views/EngineSettings/behavior/remove-engine-confirm';
import { engine, when } from './engine-fixture';

describe('installed engines', () => {
  test('the engine in use is tagged Active', () => {
    const active = engine('0.6.7', '3.12.14');
    expect(engineTags(active, active.id).map((tag) => tag.label)).toEqual(['Active']);
    expect(engineTags(active, undefined)).toEqual([]);
  });

  test('a failed install is tagged Failed with the check that failed', () => {
    const failed = engine('0.6.8', '3.12.15', { state: 'failed', smoke: { ok: false, at: 1, failed: 'host', warnings: [] } });
    const [tag] = engineTags(failed, 'other');
    expect(tag).toMatchObject({ label: 'Failed', title: 'Starting the test server failed.' });
  });

  test('a failed install with no named check still reads Failed', () => {
    const [tag] = engineTags(engine('0.6.8', '3.12.15', { state: 'failed' }), undefined);
    expect(tag?.title).toBe('The install did not finish.');
  });

  test('the meta line names the Python and the build day', () => {
    expect(installedMeta(engine('0.6.7', '3.12.14'), when)).toBe('Python 3.12.14, built day:1760000000000');
  });
});

describe('engine questions and failures', () => {
  test('removing asks by name and says sessions move to the engine in use', () => {
    const options = removeEngineConfirm(engine('0.6.7', '3.12.14'));
    expect(options.what).toBe('Archipelago 0.6.7 with Python 3.12.14');
    expect(options.consequence).toContain('hosted with the engine in use');
  });

  test('removing the engine in use says no session can run until one is installed and that the install window opens', () => {
    const options = removeEngineConfirm(engine('0.6.7', '3.12.14'), true);
    expect(options.consequence).toContain('It is the engine in use');
    expect(options.consequence).toContain('The install window opens right after');
    expect(options.consequence).not.toContain('hosted with the engine in use');
  });

  test('worlds that do not load are listed before switching', () => {
    expect(brokenWorldsConfirm('0.6.8', ['A', 'B', 'C']).message).toBe('3 installed worlds do not load on 0.6.8: A, B, C.');
    expect(brokenWorldsConfirm('0.6.8', ['A']).message).toBe('1 installed world does not load on 0.6.8: A.');
  });

  test('a failed install names the check and says the engine in use is untouched', () => {
    expect(installFailure({ outcome: 'failed', failed: 'generate' })).toBe('The new engine was not installed. Making a test seed failed. The engine in use is untouched.');
    expect(installFailure({ outcome: 'failed' })).toBe('The new engine was not installed. The engine in use is untouched.');
  });
});
