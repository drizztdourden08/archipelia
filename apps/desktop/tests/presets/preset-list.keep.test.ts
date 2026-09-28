/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import type { GamePreset, InstalledGame } from '@archipelia/model';
import { descriptionPreview } from '../../src/compounds/OptionField/behavior/description-preview';
import { ALL_TAB } from '../../src/views/PresetEditor/PresetEditor.constants';
import { advancedCount } from '../../src/views/PresetEditor/behavior/advanced-count';
import { firstTab } from '../../src/views/PresetEditor/behavior/first-tab';
import { optionTabs } from '../../src/views/PresetEditor/behavior/option-tabs';
import { visibleOptions } from '../../src/views/PresetEditor/behavior/visible-options';
import { problemMap } from '../../src/views/PresetEditor/behavior/problem-map';
import { problemSummary } from '../../src/views/PresetEditor/behavior/problem-summary';
import { sameValues } from '../../src/views/PresetEditor/behavior/same-values';
import { editedLabel } from '../../src/views/PresetsHub/behavior/edited-label';
import { buildPresetGroups } from '../../src/views/PresetsHub/behavior/build-preset-groups';
import { changedCount } from '../../src/views/PresetsHub/behavior/changed-count';
import { DEMO } from './demo-schema';

const NOW = new Date(2026, 8, 27, 15).getTime();
const DAY = 86_400_000;

const preset = (id: string, game: string, values: GamePreset['values'], name = id): GamePreset =>
  ({ id, game, name, values, updatedAt: NOW });

const INSTALLED: InstalledGame[] = [
  {
    apworld: 'demo', game: 'Demo', version: '1.0.0', source: 'official', installedAt: 0, schema: DEMO,
    sha256: '', verified: true, layout: 'apworld', path: '', requires: [],
  },
];

describe('preset groups', () => {
  test('changed counts against the schema; a missing game counts stored values', () => {
    expect(changedCount(preset('a', 'Demo', { crystals: 7, goal: 'crystals_only' }), DEMO)).toBe(1);
    expect(changedCount(preset('b', 'Gone', { x: 1, y: 2 }), undefined)).toBe(2);
  });

  test('groups installed games and preset games, sorted, with meta lines', () => {
    const groups = buildPresetGroups(INSTALLED, [
      preset('2', 'Demo', { crystals: 1 }, 'Zed'), preset('1', 'Demo', {}, 'Alpha'), preset('3', 'Aardvark', { a: 1 }),
    ], NOW);
    expect(groups.map((group) => [group.game, Boolean(group.schema)])).toEqual([['Aardvark', false], ['Demo', true]]);
    expect(groups[1]?.rows.map((row) => [row.preset.name, row.meta])).toEqual([
      ['Alpha', '0 changed · edited today'], ['Zed', '1 changed · edited today'],
    ]);
  });

  test('an installed game with no preset still shows', () => {
    expect(buildPresetGroups(INSTALLED, [], NOW)).toEqual([{ game: 'Demo', schema: DEMO, rows: [] }]);
  });

  test('edited labels read in days', () => {
    expect(editedLabel(NOW - 1000, NOW)).toBe('today');
    expect(editedLabel(NOW - DAY, NOW)).toBe('yesterday');
    expect(editedLabel(NOW - 3 * DAY, NOW)).toBe('3 days ago');
    expect(editedLabel(NOW - 30 * DAY, NOW)).toBe(new Date(NOW - 30 * DAY).toLocaleDateString());
  });
});

describe('option filter', () => {
  test('advanced options stay hidden until asked for', () => {
    expect(advancedCount(DEMO)).toBe(2);
    expect(visibleOptions(DEMO, { tab: 'Items', query: '', showAdvanced: false }).map((def) => def.key)).toEqual(['start_inventory', 'exclude']);
    expect(visibleOptions(DEMO, { tab: 'Items', query: '', showAdvanced: true })).toHaveLength(4);
  });

  test('tabs count what the search leaves, All counts everything', () => {
    const tabs = optionTabs(DEMO, { query: 'crys', showAdvanced: false });
    expect(tabs).toEqual([
      { id: 'Game Options', label: 'Game Options', count: 1 }, { id: 'Items', label: 'Items', count: 0 }, { id: ALL_TAB, label: 'All', count: 1 },
    ]);
    expect(firstTab(DEMO)).toBe('Game Options');
    expect(firstTab({ ...DEMO, groups: [] })).toBe(ALL_TAB);
  });
});

describe('editor helpers', () => {
  test('sameValues ignores key order', () => {
    expect(sameValues({ a: 1, b: [1] }, { b: [1], a: 1 })).toBe(true);
    expect(sameValues({ a: 1 }, { a: 2 })).toBe(false);
    expect(sameValues({ a: 1 }, { a: 1, b: 2 })).toBe(false);
  });

  test('problems read as sentences with option names', () => {
    const problems = [{ key: 'goal', expected: 'one of the listed choices' }];
    expect(problemMap(problems).get('goal')).toBe('Expected one of the listed choices.');
    expect(problemSummary(DEMO, problems)).toBe('1 option needs a fix before saving: Goal.');
    expect(problemSummary(DEMO, [])).toBeNull();
  });

  test('long descriptions get a preview', () => {
    expect(descriptionPreview(' Short. ')).toEqual({ preview: 'Short.', long: false });
    const long = descriptionPreview('one\ntwo\nthree');
    expect(long).toEqual({ preview: 'one\ntwo...', long: true });
    expect(descriptionPreview('word '.repeat(60)).preview.length).toBeLessThanOrEqual(183);
  });
});
