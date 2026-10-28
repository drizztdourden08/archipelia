/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { problemSlot } from '../../src/views/SessionLobby/behavior/problem-slot';
import { problemTarget } from '../../src/views/SessionLobby/behavior/problem-target';
import { presetPlayer } from './session-fixtures';

const yamlPlayer = { slot: 2, name: 'B', game: 'Demo', source: { kind: 'yaml' as const, fileName: '', yaml: '' } };

describe('problem focus on the lobby screen', () => {
  test('a player problem points at the field of the seat editor', () => {
    expect(problemTarget({ slot: 3, field: 'name', message: '' })).toBe('.session-lobby__seat-editor [data-cell="name"]');
    expect(problemTarget({ slot: 3, field: 'game', message: '' })).toBe('.session-lobby__seat-editor [data-cell="game"]');
    expect(problemTarget({ slot: 3, field: 'source', message: '' })).toBe('.session-lobby__seat-editor [data-cell="source"]');
  });

  test('an option problem points at the option row of the overrides', () => {
    expect(problemTarget({ slot: 1, field: 'option', optionKey: 'goal', optionLabel: 'Say "hi"', message: '' }))
      .toBe('.session-lobby__override-rows [role="group"][aria-label="Say \\"hi\\""]');
    expect(problemTarget({ slot: 1, field: 'option', message: '' })).toBe('.session-lobby__seat-editor');
  });

  test('a problem opens the seat of its player, and nothing when the seat is gone', () => {
    const players = [presetPlayer(1, 'A'), yamlPlayer];
    expect(problemSlot({ slot: 1, field: 'name', message: '' }, players)).toBe(1);
    expect(problemSlot({ slot: 2, field: 'source', message: '' }, players)).toBe(2);
    expect(problemSlot({ slot: 2, field: 'option', message: '' }, players)).toBe(2);
    expect(problemSlot({ slot: 5, field: 'name', message: '' }, players)).toBeNull();
  });
});
