/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import type { SessionPlayer } from '@archipelia/model';
import { playerSummary } from '../../src/views/SessionBuilder/behavior/player-summary';
import { worldSummary } from '../../src/views/SessionBuilder/behavior/world-summary';
import { newTemplate } from '../../src/views/SessionBuilder/behavior/new-template';
import { sessionSummary } from '../../src/views/Sessions/behavior/session-summary';
import { PRESET, presetPlayer } from './session-fixtures';

describe('K1 the one line of a saved player', { tags: ['critical'] }, () => {
  test('names the game and the preset, or the file', () => {
    expect(playerSummary(presetPlayer(1, 'Ana'), [PRESET])).toBe('Demo, preset Open');
    const yaml: SessionPlayer = { kind: 'set', slot: 2, name: 'Bo', game: 'Demo', source: { kind: 'yaml', fileName: 'bo.yaml', yaml: 'x' } };
    expect(playerSummary(yaml, [])).toBe('Demo, YAML bo.yaml');
  });

  test('says when a seat is open to any player, and when a game is missing', () => {
    expect(playerSummary({ kind: 'direct', slot: 3 }, [])).toBe('Open seat, any player');
    expect(playerSummary({ ...presetPlayer(4, 'Dee'), game: '' }, [PRESET])).toBe('No game picked yet');
  });
});

describe('K1 the summaries of the Sessions page', { tags: ['critical'] }, () => {
  test('sums the world settings in one line', () => {
    const { generator, server } = newTemplate('t1');
    expect(worldSummary(generator, server)).toBe('Hint cost 10%, release auto, collect auto, race off');
  });

  test('gives each saved session where it runs, its players and its last run', () => {
    const template = { ...newTemplate('t1'), players: [presetPlayer(1, 'Ana')] };
    expect(sessionSummary(template, [], undefined)).toBe('Local, 1 player, never run');
    expect(sessionSummary({ ...template, lan: true }, [], { count: 2, last: Date.UTC(2026, 9, 24, 12) })).toMatch(/^LAN, 1 player, last run .*24/);
  });
});
