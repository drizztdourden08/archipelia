/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import type { Session } from '@archipelia/model';
import { newTemplate } from '../../src/views/SessionBuilder/behavior/new-template';
import { hostOfKind } from '../../src/views/SessionBuilder/behavior/host-of-kind';
import { withPort } from '../../src/views/SessionBuilder/behavior/with-port';
import { filterRuns } from '../../src/views/History/behavior/filter-runs';
import { runChip } from '../../src/views/History/behavior/run-chip';
import { statusOf } from '../../src/views/History/behavior/run-status';
import { NO_FILTER } from '../../src/stores/history-filter-store.constants';
import { hostLabel } from '@archipelia/model';
import { playersLabel } from '../../src/views/Sessions/behavior/players-label';
import { whereLabel } from '../../src/views/Sessions/behavior/where-label';
import { runStatsOf } from '../../src/runs/run-stats-of';
import { presetPlayer } from './session-fixtures';

const TEMPLATE = { ...newTemplate('t1'), name: 'Friday night', players: [presetPlayer(1, 'Johnny'), presetPlayer(2, 'Marie')] };

describe('session summary', () => {
  test('the row says where the session runs and how many players it has', () => {
    expect(whereLabel(TEMPLATE, [])).toBe('Local');
    expect(whereLabel({ ...TEMPLATE, lan: true }, [])).toBe('LAN');
    expect(hostLabel({ kind: 'archipelago-gg' })).toBe('archipelago.gg');
    expect(playersLabel(2)).toBe('2 players');
    expect(playersLabel(1)).toBe('1 player');
  });
});

describe('run summary', () => {
  const session = (patch: Partial<Session>): Session => ({ id: 's1', status: 'hosting', createdAt: 0, snapshot: TEMPLATE, ...patch });
  const source = (match: 'recorded' | 'name' | 'unknown', changes: number) =>
    ({ sessionId: 't1', sessionName: 'Friday night', match, overrides: Array.from({ length: changes }, (_, n) => ({ field: `f${n}`, label: 'x', from: 'a', to: 'b' })) });

  test('the runs of a session are counted with the date of the last one', () => {
    const runs = [session({ id: 'a', createdAt: 10, source: source('recorded', 0) }), session({ id: 'b', createdAt: 30, source: source('recorded', 1) }), session({ id: 'c', createdAt: 20 })];
    expect(runStatsOf(runs)).toEqual({ t1: { count: 2, last: 30 } });
  });

  test('status tones follow the run state', () => {
    expect(statusOf(session({}))).toEqual({ label: 'Hosting', tone: 'success' });
    expect(statusOf(session({ status: 'stopped' })).tone).toBe('neutral');
    expect(statusOf(session({ status: 'failed', error: 'boom' }))).toMatchObject({ label: 'Generation failed', tone: 'danger' });
  });

  test('the chip names the source and counts its changes, and invents nothing for an old run', () => {
    expect(runChip(session({ source: source('recorded', 2) }))).toEqual({ text: 'from Friday night, 2 changes', recorded: true });
    expect(runChip(session({ source: source('recorded', 0) })).text).toBe('from Friday night');
    expect(runChip(session({ source: source('name', 0) })).text).toBe('Source matched by name');
    expect(runChip(session({ source: source('unknown', 0) })).text).toBe('Unknown source');
  });

  test('the filters narrow by session, status and date, and the search by text', () => {
    const day = 24 * 60 * 60 * 1000;
    const runs = [session({ id: 'a', status: 'stopped', createdAt: 100 * day, source: source('recorded', 0) }), session({ id: 'b', status: 'failed', createdAt: 50 * day, seed: '77' })];
    const ids = (filter: Partial<typeof NO_FILTER>, query = '') => filterRuns(runs, { ...NO_FILTER, ...filter }, query, 101 * day).map((run) => run.id);
    expect(ids({})).toEqual(['a', 'b']);
    expect(ids({ sessionKey: 't1' })).toEqual(['a']);
    expect(ids({ status: 'failed' })).toEqual(['b']);
    expect(ids({ range: '7' })).toEqual(['a']);
    expect(ids({}, '77')).toEqual(['b']);
  });
});

describe('host target', () => {
  test('switching kind keeps the current target or builds a default one', () => {
    const local = { kind: 'local' as const, port: 1234 };
    expect(hostOfKind('local', local, [])).toBe(local);
    expect(hostOfKind('remote', local, [])).toEqual({ kind: 'remote', serverId: '' });
    expect(withPort(local, 40000.4)).toEqual({ kind: 'local', port: 40000 });
  });
});
