/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { optionDef as option } from '@archipelia/model';
import type { GameSchema } from '@archipelia/model';
import { changedValues, checkValues, resolveValues } from '../src';

const SCHEMA: GameSchema = {
  game: 'Demo', worldVersion: '1.0.0', groups: ['Game Options'], presets: {},
  options: [
    option({ key: 'death_link', kind: 'toggle', default: false }),
    option({ key: 'goal', kind: 'choice', default: 'ganon', choices: [{ value: 'ganon', label: 'ganon' }, { value: 'pedestal', label: 'pedestal' }] }),
    option({ key: 'crystals', kind: 'range', default: 7, range: { min: 0, max: 7 } }),
    option({ key: 'pieces', kind: 'named-range', default: 30, range: { min: 1, max: 90 }, namedValues: { easy: 20, hard: 40 } }),
    option({ key: 'start_inventory', kind: 'counter', default: {}, validKeys: ['Bombs', 'Arrows'] }),
    option({ key: 'exclude', kind: 'set', default: [] }),
    option({ key: 'bosses', kind: 'dict', default: { Moldorm: 'Helmasaur' } }),
  ],
};

describe('resolveValues', () => {
  test('defaults, then the preset, then the overrides; unknown keys are dropped', () => {
    const values = resolveValues(SCHEMA, { goal: 'pedestal', crystals: 3, removed: 1 }, { crystals: 5 });
    expect(values).toMatchObject({ death_link: false, goal: 'pedestal', crystals: 5 });
    expect(values).not.toHaveProperty('removed');
  });

  test('changedValues keeps only what differs from the defaults', () => {
    expect(changedValues(SCHEMA, { goal: 'ganon', crystals: 2, bosses: { Moldorm: 'Helmasaur' } })).toEqual({ crystals: 2 });
  });
});

describe('checkValues', () => {
  test('every default passes', () => {
    expect(checkValues(SCHEMA, resolveValues(SCHEMA))).toEqual([]);
  });

  test('each kind rejects a wrong value', () => {
    const problems = checkValues(SCHEMA, {
      death_link: 'yes', goal: 'moon', crystals: 9, pieces: 'medium', start_inventory: { Rupees: 5 }, exclude: [1], bosses: [],
    });
    expect(problems.map((p) => p.key)).toEqual(['death_link', 'goal', 'crystals', 'pieces', 'start_inventory', 'exclude', 'bosses']);
  });

  test('a named value passes by name or by number', () => {
    expect(checkValues(SCHEMA, { pieces: 'hard' })).toEqual([]);
    expect(checkValues(SCHEMA, { pieces: 40 })).toEqual([]);
  });
});
