/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { worldSummary } from '../../src/views/SessionBuilder/behavior/world-summary';
import { newTemplate } from '../../src/views/SessionBuilder/behavior/new-template';
import { sessionSummary } from '../../src/views/Sessions/behavior/session-summary';
import { presetPlayer } from './session-fixtures';

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
