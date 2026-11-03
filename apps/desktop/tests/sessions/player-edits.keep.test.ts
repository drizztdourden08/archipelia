/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { overridesLabel } from '../../src/views/SessionLobby/behavior/overrides-label';
import { withGame } from '../../src/views/SessionLobby/behavior/with-game';
import { withOverride } from '../../src/views/SessionLobby/behavior/with-override';
import { withoutOverride } from '../../src/views/SessionLobby/behavior/without-override';
import { withYaml } from '../../src/views/SessionLobby/behavior/with-yaml';
import { gameOptionsOf } from '../../src/views/SessionLobby/behavior/game-options-of';
import { parseSource } from '../../src/views/SessionLobby/behavior/parse-source';
import { sourceOptionsOf } from '../../src/views/SessionLobby/behavior/source-options-of';
import { sourceValueOf } from '../../src/views/SessionLobby/behavior/source-value-of';
import { GAME, PRESET, presetPlayer } from './session-fixtures';

describe('K1 player edits', { tags: ['critical'] }, () => {
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

describe('K1 source options', { tags: ['critical'] }, () => {
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
