/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { UNKNOWN_SOURCE_NAME, lobbyTemplateId, runOf } from '../src';
import { oldRun, template, withLegacyDirect } from './old-records';

const SAVED = [template(), template({ id: 'friday', name: 'Friday race' })];

describe('a run read from disk', () => {
  test('takes its source from the saved session it recorded', () => {
    const run = runOf(oldRun(), SAVED);
    expect(run.source).toEqual({ sessionId: 'sunday', sessionName: 'Sunday run', overrides: [], match: 'recorded' });
  });

  test('finds the session of a lobby run by the lobby the session still owns', () => {
    const owner = template({ id: 'friday', name: 'Renamed', lobby: { serverId: 'local', lobbyId: 'lb_9' } });
    const run = runOf(oldRun({ templateId: lobbyTemplateId('lb_9'), lobbyId: 'lb_9' }), [owner]);
    expect(run.source).toMatchObject({ sessionId: 'friday', match: 'recorded' });
  });

  test('matches by name when nothing else links the run, and says so', () => {
    const run = runOf(oldRun({ templateId: lobbyTemplateId('lb_gone'), lobbyId: 'lb_gone' }), SAVED);
    expect(run.source).toMatchObject({ sessionId: 'sunday', sessionName: 'Sunday run', match: 'name' });
  });

  test('has an unknown source when the session is gone', () => {
    const run = runOf(oldRun({ templateId: 'deleted' }), []);
    expect(run.source).toEqual({ sessionName: UNKNOWN_SOURCE_NAME, overrides: [], match: 'unknown' });
  });

  test('takes its players from the snapshot with no origin', () => {
    const run = runOf(oldRun(), SAVED);
    expect(run.players).toEqual([{ slot: 1, name: 'Drizzt', game: 'Hollow Knight' }, { slot: 2, name: 'Alice', game: 'Celeste' }]);
  });

  test('migrates the snapshot like a saved session and keeps the rest of the record', () => {
    const run = runOf(oldRun({ snapshot: withLegacyDirect() }), SAVED);
    expect(run.snapshot.lobby).toEqual({ serverId: 'r1', lobbyId: 'lb_1' });
    expect(run.snapshot.players.every((player) => player.direct === false)).toBe(true);
    expect(run).toMatchObject({ id: 'run1', status: 'stopped', seed: '48213', createdAt: 2000 });
  });

  test('keeps what a new run recorded', () => {
    const recorded = { sessionId: 'friday', sessionName: 'Friday race', overrides: [], match: 'recorded' as const };
    const players = [{ slot: 1, name: 'Drizzt', game: 'Hollow Knight', origin: 'added' as const }];
    const run = runOf(oldRun({ source: recorded, players }), []);
    expect(run.source).toBe(recorded);
    expect(run.players).toBe(players);
  });
});
