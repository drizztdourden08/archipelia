/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import type { GamePreset, InstalledGame } from '@archipelia/model';
import { ALL_TAB } from '../../src/views/PresetEditor/PresetEditor.constants';
import { advancedCount } from '../../src/views/PresetEditor/behavior/advanced-count';
import { firstTab } from '../../src/views/PresetEditor/behavior/first-tab';
import { optionTabs } from '../../src/views/PresetEditor/behavior/option-tabs';
import { visibleOptions } from '../../src/views/PresetEditor/behavior/visible-options';
import { problemMap } from '../../src/views/PresetEditor/behavior/problem-map';
import { problemSummary } from '../../src/views/PresetEditor/behavior/problem-summary';
import { sameValues } from '../../src/views/PresetEditor/behavior/same-values';
import { editedLabel } from '../../src/views/PresetsHub/behavior/edited-label';
import { buildPresetRows } from '../../src/views/PresetsHub/behavior/build-preset-rows';
import { saveBlock } from '../../src/views/PresetEditor/behavior/save-block';
import { saveState } from '../../src/views/PresetEditor/behavior/save-state';
import { withProblem } from '../../src/views/PresetEditor/behavior/with-problem';
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

  test('rows sort by game then name, with a meta line and the group of their game', () => {
    const rows = buildPresetRows(INSTALLED, [
      preset('2', 'Demo', { crystals: 1 }, 'Zed'), preset('1', 'Demo', {}, 'Alpha'), preset('3', 'Aardvark', { a: 1 }),
    ], NOW);
    expect(rows.map((row) => [row.preset.name, row.meta, row.group])).toEqual([
      ['3', '1 changed · edited today', 'Aardvark · game not installed'],
      ['Alpha', '0 changed · edited today', 'Demo'],
      ['Zed', '1 changed · edited today', 'Demo'],
    ]);
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
    const tabs = optionTabs(DEMO, { query: 'crys', showAdvanced: false }, new Set(['goal', 'exclude']));
    expect(tabs).toEqual([
      { id: 'Game Options', label: 'Game Options', count: 1, changed: 1 },
      { id: 'Items', label: 'Items', count: 0, changed: 1 },
      { id: ALL_TAB, label: 'All', count: 1, changed: 2 },
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
});

describe('save bar', () => {
  const facts = { busy: false, dirty: true, block: null, failure: null, saved: false };

  test('the state follows the edits, the save and what blocks it', () => {
    expect(saveState({ ...facts, dirty: false })).toBe('clean');
    expect(saveState(facts)).toBe('dirty');
    expect(saveState({ ...facts, busy: true })).toBe('saving');
    expect(saveState({ ...facts, dirty: false, saved: true })).toBe('saved');
    expect(saveState({ ...facts, failure: 'Disk full' })).toBe('error');
    expect(saveState({ ...facts, dirty: false, failure: 'Disk full' })).toBe('clean');
    expect(saveState({ ...facts, block: 'Give the preset a name before saving.' })).toBe('error');
  });

  test('a save is blocked by an empty name, JSON that does not parse, then refused values', () => {
    const problems = [{ key: 'goal', expected: 'one of the listed choices' }];
    expect(saveBlock(DEMO, ' ', problems, ['bosses'])).toBe('Give the preset a name before saving.');
    expect(saveBlock(DEMO, 'Fast', problems, ['bosses'])).toBe('Fix the JSON of bosses before saving.');
    expect(saveBlock(DEMO, 'Fast', problems, [])).toBe('1 option needs a fix before saving: Goal.');
    expect(saveBlock(DEMO, 'Fast', [], [])).toBeNull();
  });

  test('a JSON problem is held once per option until it clears', () => {
    expect(withProblem([], 'bosses', 'Expected a value')).toEqual(['bosses']);
    expect(withProblem(['bosses'], 'bosses', 'Expected a value')).toEqual(['bosses']);
    expect(withProblem(['bosses', 'plando'], 'bosses', null)).toEqual(['plando']);
  });
});
