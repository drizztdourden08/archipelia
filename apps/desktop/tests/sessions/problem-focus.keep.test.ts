/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { problemSlot } from '../../src/views/SessionBuilder/behavior/problem-slot';
import { problemTarget } from '../../src/views/SessionBuilder/behavior/problem-target';
import { presetPlayer } from './session-fixtures';

const yamlPlayer = { slot: 2, name: 'B', game: 'Demo', source: { kind: 'yaml' as const, fileName: '', yaml: '' } };

describe('problem focus', () => {
  test('a session problem points at its field', () => {
    expect(problemTarget({ field: 'session-name', message: 'The session needs a name' })).toBe('[data-problem-target="session-name"]');
    expect(problemTarget({ field: 'players', message: 'Add at least one player' })).toBe('.session-builder__players');
    expect(problemTarget({ field: 'host', message: 'Pick a server to host on' })).toBe('[data-section="host"]');
  });

  test('a player problem points at the field of its row', () => {
    expect(problemTarget({ slot: 3, field: 'name', message: '' })).toBe('.session-builder__players [data-row-key="3"] [data-cell="name"]');
    expect(problemTarget({ slot: 3, field: 'game', message: '' })).toBe('.session-builder__players [data-row-key="3"] [data-cell="game"]');
    expect(problemTarget({ slot: 3, field: 'source', message: '' })).toBe('.session-builder__players [data-row-key="3"] [data-cell="source"]');
  });

  test('an option problem points at the option row of the overrides', () => {
    expect(problemTarget({ slot: 1, field: 'option', optionKey: 'goal', optionLabel: 'Say "hi"', message: '' }))
      .toBe('.session-builder__override-rows [role="group"][aria-label="Say \\"hi\\""]');
  });

  test('a problem selects a preset player, never an imported one', () => {
    const players = [presetPlayer(1, 'A'), yamlPlayer];
    expect(problemSlot({ slot: 1, field: 'name', message: '' }, players)).toBe(1);
    expect(problemSlot({ slot: 2, field: 'source', message: '' }, players)).toBeNull();
    expect(problemSlot({ field: 'host', message: '' }, players)).toBeNull();
  });
});
