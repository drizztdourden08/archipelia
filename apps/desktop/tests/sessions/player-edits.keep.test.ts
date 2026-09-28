/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { overrideRows } from '../../src/views/SessionBuilder/behavior/override-rows';
import { overridesLabel } from '../../src/views/SessionBuilder/behavior/overrides-label';
import { withGame } from '../../src/views/SessionBuilder/behavior/with-game';
import { withOverride } from '../../src/views/SessionBuilder/behavior/with-override';
import { withoutOverride } from '../../src/views/SessionBuilder/behavior/without-override';
import { withYaml } from '../../src/views/SessionBuilder/behavior/with-yaml';
import { gameOptionsOf } from '../../src/views/SessionBuilder/behavior/game-options-of';
import { parseSource } from '../../src/views/SessionBuilder/behavior/parse-source';
import { sourceOptionsOf } from '../../src/views/SessionBuilder/behavior/source-options-of';
import { sourceValueOf } from '../../src/views/SessionBuilder/behavior/source-value-of';
import { GAME, PRESET, presetPlayer } from './session-fixtures';

describe('player edits', () => {
  test('an override equal to the preset value is dropped', () => {
    const changed = withOverride(presetPlayer(1, 'A'), 'crystals', 3, 5);
    expect(changed.source).toMatchObject({ overrides: { crystals: 3 } });
    expect(overridesLabel(changed)).toBe('1 changed');
    expect(withOverride(changed, 'crystals', 5, 5).source).toMatchObject({ overrides: {} });
    expect(withoutOverride(changed, 'crystals').source).toMatchObject({ overrides: {} });
  });

  test('changing the game picks its first preset and clears overrides', () => {
    const player = withOverride(presetPlayer(1, 'A', '', 'Other'), 'x', 1, 0);
    expect(withGame(player, 'Demo', [PRESET]).source).toEqual({ kind: 'preset', presetId: 'p1', overrides: {} });
  });

  test('an imported file sets the game from the file', () => {
    const player = withYaml(presetPlayer(1, 'A'), 'a.yaml', 'game: Other', 'Other');
    expect(player).toMatchObject({ game: 'Other', source: { kind: 'yaml', fileName: 'a.yaml' } });
    expect(overridesLabel(player)).toBe('from file');
  });
});

describe('source options', () => {
  test('presets of the game, then imported file; a default preset is offered when none exists', () => {
    expect(sourceOptionsOf('Demo', [PRESET]).map((o) => o.value)).toEqual(['preset:p1', 'yaml']);
    expect(sourceOptionsOf('Other', [PRESET]).map((o) => o.value)).toEqual(['new-preset', 'yaml']);
    expect(parseSource('preset:p1')).toEqual({ kind: 'preset', presetId: 'p1' });
    expect(sourceValueOf(presetPlayer(1, 'A'))).toBe('preset:p1');
  });

  test('a game that is not installed stays listed and marked', () => {
    expect(gameOptionsOf([GAME], 'Gone')).toEqual([
      { value: 'Demo', label: 'Demo' }, { value: 'Gone', label: 'Gone (not installed)' },
    ]);
  });
});

describe('override rows', () => {
  test('rows show the preset value, the resolved value and inline problems', () => {
    const rows = overrideRows(GAME.schema, PRESET, { crystals: 9 });
    const crystals = rows.find((row) => row.def.key === 'crystals');
    expect(crystals).toMatchObject({ presetValue: 5, value: 9, overridden: true, problem: 'must be between 0 and 7' });
    expect(overrideRows(GAME.schema, PRESET, { crystals: 9 }, { changedOnly: true }).map((row) => row.def.key)).toEqual(['crystals']);
    expect(overrideRows(GAME.schema, PRESET, {}, { query: 'goal' }).map((row) => row.def.key)).toEqual(['goal']);
  });
});
