/* @layer tests @kind test */
import { applyRequirementRules, createEngineSpec, ENGINE_DEFAULTS, engineId as engineIdOf } from '@archipelia/engine';
import { describe, expect, test } from 'vitest';
import { applyRules } from '../src/apply-rules.mjs';
import { defaultSpec } from '../src/default-spec.mjs';
import { engineId } from '../src/engine-id.mjs';

const PAIRS = [
  ['0.6.2', '3.11.9'],
  ['0.6.7', '3.12.14'],
  ['0.6.8', '3.12.15'],
  ['0.6.8', '3.13.17'],
  ['0.7.0', '3.14.9'],
];

describe('K1 the default spec', { tags: ['critical'] }, () => {
  test('refuses a target with no default Python', () => {
    expect(() => defaultSpec('freebsd-x64')).toThrow('no default Python');
  });

  test('matches the spec the app builds from the same choice', () => {
    const spec = defaultSpec('win32-x64');
    const pinned = ENGINE_DEFAULTS.defaultPython['win32-x64'];
    expect(createEngineSpec({ ap: ENGINE_DEFAULTS.defaultAp, python: { ...pinned, target: 'win32-x64' } })).toEqual(spec);
  });
});

describe('S4 the script copy of the rule logic', { tags: ['standard'] }, () => {
  test.each(PAIRS)('applies the same rules as the app for Archipelago %s and Python %s', (ap, python) => {
    expect(applyRules(ENGINE_DEFAULTS.requirementRules, ap, python)).toEqual(applyRequirementRules(ENGINE_DEFAULTS.requirementRules, ap, python));
  });

  test.each(PAIRS)('names the folder of %s and %s the same way', (ap, python) => {
    expect(engineId(ap, python, 'win32-x64')).toBe(engineIdOf(ap, python, 'win32-x64'));
  });
});
