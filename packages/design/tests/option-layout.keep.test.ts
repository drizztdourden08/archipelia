/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { optionDef as option } from '@archipelia/model';
import type { GameSchema } from '@archipelia/model';
import { matchesQuery } from '../src/compounds/GameOptionsPanel/behavior/matches-query';
import { optionLayoutOf } from '../src/compounds/GameOptionsPanel/behavior/option-layout';
import { tabIdOf } from '../src/compounds/GameOptionsPanel/behavior/tab-id-of';
import { choiceOptions } from '../src/compounds/OptionControl/behavior/choice-options';
import { hintOf } from '../src/compounds/OptionControl/behavior/option-hint';
import { defOf } from './option-defs';

describe('K1 random on a choice', { tags: ['critical'] }, () => {
  const medallion = option({ key: 'misery_mire_medallion', kind: 'choice', default: 'random', choices: [{ value: 'ether', label: 'ether' }, { value: 'quake', label: 'quake' }] });

  test('the select offers Random after the listed choices, once', () => {
    expect(choiceOptions(medallion).map((entry) => entry.value)).toEqual(['ether', 'quake', 'random']);
    const listed = option({ key: 'x', kind: 'choice', default: 'random', choices: [{ value: 'random', label: 'random' }, { value: 'ether', label: 'ether' }] });
    expect(choiceOptions(listed).map((entry) => entry.value)).toEqual(['random', 'ether']);
  });

  test('the default reads as Random in the hint', () => {
    expect(hintOf(medallion)).toContain('Random');
  });
});

const KEYS = ['death_link', 'goal', 'crystals', 'pieces', 'seed_name', 'start_inventory', 'exclude', 'plando', 'bosses'];

const SCHEMA: GameSchema = { game: 'Demo', worldVersion: '1.2.0', groups: ['Game Options', 'Items'], presets: {}, options: KEYS.map(defOf) };

const keysOf = (rows: { key: string }[]) => rows.map((row) => row.key);

describe('K1 option layout', { tags: ['critical'] }, () => {
  test('the groups of the schema are the tabs, and a schema without groups gets one Options tab', () => {
    expect(optionLayoutOf(SCHEMA, {}).tabs.map((tab) => tab.id)).toEqual(['Game Options', 'Items']);
    const flat = optionLayoutOf({ ...SCHEMA, groups: [] }, {});
    expect(flat.tabs.map((tab) => tab.id)).toEqual(['Options']);
    expect(flat.tabs[0].basic.length).toBeGreaterThan(0);
  });

  test('each tab lists its basic options first and its advanced ones apart', () => {
    const items = optionLayoutOf(SCHEMA, {}).tabs.find((tab) => tab.id === 'Items');
    expect(keysOf(items?.basic ?? [])).toEqual(['start_inventory', 'exclude']);
    expect(keysOf(items?.advanced ?? [])).toEqual(['plando', 'bosses']);
  });

  test('the search keeps the options that match, and the changed counts ignore it', () => {
    const layout = optionLayoutOf(SCHEMA, { goal: 'crystals_only', exclude: ['Bow'] }, 'crys');
    const [options, items] = layout.tabs;
    expect(keysOf(options.basic)).toEqual(['crystals']);
    expect(items?.basic).toHaveLength(0);
    expect([options.changed, items?.changed]).toEqual([1, 1]);
    expect(keysOf(layout.changedRows)).toEqual(['goal', 'exclude']);
  });

  test('an option opens the tab of its group, and a search that hides it is cleared', () => {
    expect(tabIdOf(SCHEMA, defOf('exclude'))).toBe('Items');
    expect(tabIdOf({ ...SCHEMA, groups: [] }, defOf('exclude'))).toBe('Options');
    expect(matchesQuery(defOf('goal'), 'goal')).toBe(true);
    expect(matchesQuery(defOf('goal'), 'zzz')).toBe(false);
    expect(matchesQuery(defOf('goal'), '')).toBe(true);
  });
});
