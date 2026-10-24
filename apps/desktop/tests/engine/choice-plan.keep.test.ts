/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { changeActions } from '../../src/views/EngineSettings/behavior/change-actions';
import { choicePlan } from '../../src/views/EngineSettings/behavior/choice-plan';
import { engine, overviewOf } from './engine-fixture';

describe('what the pick would do', () => {
  test('the engine in use needs nothing', () => {
    expect(choicePlan(overviewOf(), { ap: '0.6.7', python: '3.12.14' })).toEqual({ kind: 'none' });
  });

  test('a pair that is not installed is an install with the build release', () => {
    expect(choicePlan(overviewOf(), { ap: '0.6.8', python: '3.12.15' })).toEqual({
      kind: 'install', choice: { ap: '0.6.8', python: '3.12.15', pythonRelease: '20261021' },
    });
  });

  test('a pair that is already installed is a switch', () => {
    const other = engine('0.6.2', '3.12.14');
    const overview = overviewOf({ installed: [engine('0.6.7', '3.12.14'), other] });
    expect(choicePlan(overview, { ap: '0.6.2', python: '3.12.14' })).toEqual({ kind: 'switch', id: other.id });
  });

  test('a failed install of the pair is installed again', () => {
    const failed = engine('0.6.8', '3.12.15', { state: 'failed' });
    const overview = overviewOf({ installed: [engine('0.6.7', '3.12.14'), failed] });
    expect(choicePlan(overview, { ap: '0.6.8', python: '3.12.15' }).kind).toBe('install');
  });

  test('older versions install like newer ones', () => {
    expect(choicePlan(overviewOf(), { ap: '0.6.2', python: '3.12.14' }).kind).toBe('install');
  });

  test('a first run with nothing installed installs', () => {
    const first = overviewOf({ active: undefined, installed: [] });
    expect(choicePlan(first, { ap: '0.6.8', python: '3.12.14' }).kind).toBe('install');
  });

  test('no plan before the versions load or without a pick', () => {
    expect(choicePlan(null, { ap: '0.6.8', python: '3.12.14' })).toEqual({ kind: 'none' });
    expect(choicePlan(overviewOf(), {})).toEqual({ kind: 'none' });
  });
});

describe('the change action', () => {
  const noop = () => undefined;

  test('says what it does and goes off while busy', () => {
    const [install] = changeActions({ kind: 'install', choice: { ap: '0.6.8', python: '3.12.15', pythonRelease: '1' } }, false, noop);
    const [switchTo] = changeActions({ kind: 'switch', id: 'x' }, true, noop);
    expect(install).toMatchObject({ label: 'Install and switch', disabled: false });
    expect(switchTo).toMatchObject({ label: 'Switch', disabled: true });
  });

  test('is absent when nothing changes', () => {
    expect(changeActions({ kind: 'none' }, false, noop)).toEqual([]);
  });
});
