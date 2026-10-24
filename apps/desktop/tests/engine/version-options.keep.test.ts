/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { chosenVersions } from '../../src/views/EngineSettings/behavior/chosen-versions';
import { pythonOptions } from '../../src/views/EngineSettings/behavior/python-options';
import { releaseOptions } from '../../src/views/EngineSettings/behavior/release-options';
import { engine, feedOf, overviewOf, release } from './engine-fixture';

describe('Archipelago picker options', () => {
  test('lists every release newest first and marks the latest and the one in use', () => {
    const options = releaseOptions(overviewOf());
    expect(options.map((option) => option.value)).toEqual(['0.6.8', '0.6.7', '0.6.2']);
    expect(options[0]?.hint).toBe('latest');
    expect(options[1]?.hint).toBe('in use');
    expect(options[2]?.hint).toBeUndefined();
  });

  test('older releases stay pickable', () => {
    expect(releaseOptions(overviewOf()).some((option) => option.value === '0.6.2' && !option.disabled)).toBe(true);
  });

  test('an installed release the list no longer carries is still offered', () => {
    const kept = engine('0.5.1', '3.12.14');
    const options = releaseOptions(overviewOf({ installed: [kept, engine('0.6.7', '3.12.14')] }));
    expect(options.map((option) => option.value)).toEqual(['0.6.8', '0.6.7', '0.6.2', '0.5.1']);
    expect(options[3]?.hint).toBe('installed');
  });

  test('with no list the installed releases are all there is', () => {
    const options = releaseOptions(overviewOf({ feed: feedOf({ state: 'never', releases: [], checkedAt: undefined }) }));
    expect(options.map((option) => option.value)).toEqual(['0.6.7']);
  });
});

describe('Python picker options', () => {
  test('lists the builds and marks the tested one and the one in use', () => {
    const options = pythonOptions(overviewOf());
    expect(options.map((option) => option.value)).toEqual(['3.13.17', '3.12.15', '3.12.14']);
    expect(options[2]?.hint).toBe('tested with this app, in use');
    expect(options[0]?.hint).toBeUndefined();
  });

  test('an installed Python the list does not carry is still offered', () => {
    const options = pythonOptions(overviewOf({ installed: [engine('0.6.7', '3.11.9'), engine('0.6.8', '3.12.14')] }));
    expect(options.at(-1)).toEqual({ value: '3.11.9', label: '3.11.9', hint: 'installed' });
  });
});

describe('the versions the pickers show', () => {
  test('start from the engine in use', () => {
    expect(chosenVersions(overviewOf(), {})).toEqual({ ap: '0.6.7', python: '3.12.14' });
  });

  test('keep a pick that is still listed', () => {
    expect(chosenVersions(overviewOf(), { ap: '0.6.8', python: '3.13.17' })).toEqual({ ap: '0.6.8', python: '3.13.17' });
  });

  test('drop a pick that is gone', () => {
    expect(chosenVersions(overviewOf(), { ap: '9.9.9' }).ap).toBe('0.6.7');
  });

  test('a first run starts at the newest release and the tested Python', () => {
    const first = overviewOf({ active: undefined, installed: [], tag: 'not-checked' });
    expect(chosenVersions(first, {})).toEqual({ ap: '0.6.8', python: '3.12.14' });
  });

  test('nothing is chosen before the versions load', () => {
    expect(chosenVersions(null, { ap: '0.6.8' })).toEqual({});
  });

  test('a release added to the feed later is a valid pick', () => {
    const next = overviewOf({ feed: feedOf({ releases: [release('0.6.9'), release('0.6.8')] }) });
    expect(chosenVersions(next, { ap: '0.6.9' }).ap).toBe('0.6.9');
  });
});
