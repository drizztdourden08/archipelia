/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { addPlayer } from '../../src/views/SessionBuilder/behavior/add-player';
import { DEFAULT_PORT } from '../../src/views/SessionBuilder/SessionBuilder.constants';
import { duplicatePlayer } from '../../src/views/SessionBuilder/behavior/duplicate-player';
import { duplicateTemplate } from '../../src/views/SessionBuilder/behavior/duplicate-template';
import { freeName } from '../../src/views/SessionBuilder/behavior/free-name';
import { newTemplate } from '../../src/views/SessionBuilder/behavior/new-template';
import { nextSlot } from '../../src/views/SessionBuilder/behavior/next-slot';
import { passwordNameOf } from '../../src/views/SessionBuilder/behavior/password-name-of';
import { removePlayer } from '../../src/views/SessionBuilder/behavior/remove-player';
import { presetPlayer } from './session-fixtures';

describe('new template defaults', () => {
  test('a new template hosts locally on the default port with a full spoiler', () => {
    const template = newTemplate('t1');
    expect(template).toMatchObject({ id: 't1', players: [], host: { kind: 'local', port: DEFAULT_PORT } });
    expect(template.generator).toEqual({ spoiler: 3, race: false, progressionBalancing: true });
    expect(template.server).toMatchObject({ hintCost: 10, releaseMode: 'auto', collectMode: 'auto', remainingMode: 'goal' });
    expect(template.server.passwordRef).toBeUndefined();
  });

  test('the room password secret is named after the template', () => {
    expect(passwordNameOf('abc')).toBe('room-password-abc');
  });
});

describe('player numbering', () => {
  test('slots continue after the highest one and names stay unique', () => {
    const players = [presetPlayer(1, 'Player1'), presetPlayer(2, 'Player2')];
    expect(nextSlot(players)).toBe(3);
    const next = addPlayer(players, 'Demo', 'p1');
    expect(next[2]).toMatchObject({ slot: 3, name: 'Player3', game: 'Demo', source: { kind: 'preset', presetId: 'p1', overrides: {} } });
  });

  test('removing a player renumbers the rest from one', () => {
    const players = [presetPlayer(1, 'A'), presetPlayer(2, 'B'), presetPlayer(3, 'C')];
    expect(removePlayer(players, 2).map((p) => [p.slot, p.name])).toEqual([[1, 'A'], [2, 'C']]);
  });

  test('duplicating inserts a copy after the source with a free name', () => {
    const players = [presetPlayer(1, 'Johnny'), presetPlayer(2, 'Marie')];
    const next = duplicatePlayer(players, 1);
    expect(next.map((p) => [p.slot, p.name])).toEqual([[1, 'Johnny'], [2, 'Johnny1'], [3, 'Marie']]);
    expect(next[1]?.source).not.toBe(players[0]?.source);
  });

  test('a free name skips the taken ones, ignoring case', () => {
    expect(freeName([presetPlayer(1, 'sam1')], 'Sam')).toBe('Sam2');
  });

  test('a duplicated template gets a new id, a copy name and a fresh date', () => {
    const template = { ...newTemplate('t1'), name: 'Friday', updatedAt: 99 };
    const copy = duplicateTemplate(template, ['Friday', 'Friday copy'], 't2');
    expect(copy).toMatchObject({ id: 't2', name: 'Friday copy 2', updatedAt: 0 });
  });
});
