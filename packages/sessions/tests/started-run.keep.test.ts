/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import type { SessionTemplate } from '@archipelia/model';
import type { LobbyRun } from '../src/service/lobby-run.type';
import { startedRun } from '../src/service/started-run';

const TEMPLATE: SessionTemplate = {
  id: 'lobby:lb_1', name: 'Sunday run', updatedAt: 0,
  players: [
    { slot: 1, name: 'Drizzt', game: 'Celeste', source: { kind: 'preset', presetId: '', overrides: {} } },
    { slot: 2, name: 'Alice', game: 'Hollow Knight', source: { kind: 'yaml', fileName: 'alice.yaml', yaml: 'name: Alice' } },
  ],
  generator: { spoiler: 3, race: false, progressionBalancing: true },
  server: { hintCost: 5, releaseMode: 'auto', collectMode: 'auto', remainingMode: 'goal', autoShutdownMinutes: 0 },
  host: { kind: 'local', port: 38281 },
};

const SOURCE = { sessionId: 's1', sessionName: 'Sunday run', overrides: [{ field: 'server.hintCost', label: 'Hint cost', from: '10', to: '5' }] };

const PLAYERS = [
  { slot: 1, name: 'Drizzt', game: 'Celeste', origin: 'saved' as const },
  { slot: 2, name: 'Alice', game: 'Hollow Knight', origin: 'joined' as const, member: { displayName: 'Alice', client: 'Alice PC', trust: 'verified' as const } },
];

const lobbyRun = (patch: Partial<LobbyRun> = {}): LobbyRun => ({ lobbyId: 'lb_1', worlds: [], runtime: {} as LobbyRun['runtime'], ...patch });

describe('the first record of a run', () => {
  test('a lobby run keeps the source and players its lobby handed over, and its lobby and worlds', () => {
    const run = startedRun(TEMPLATE, lobbyRun({ source: SOURCE, players: PLAYERS, worlds: [{ game: 'Celeste', sha256: 'w' }] }), 'r1', 7);
    expect(run).toMatchObject({
      id: 'r1', createdAt: 7, status: 'generating', templateId: 'lobby:lb_1', lobbyId: 'lb_1', worlds: [{ game: 'Celeste', sha256: 'w' }],
      source: { ...SOURCE, match: 'recorded' }, players: PLAYERS,
    });
  });

  test('a lobby run with no source from its lobby has an unknown source', () => {
    expect(startedRun(TEMPLATE, lobbyRun(), 'r1', 7).source).toMatchObject({ match: 'unknown', overrides: [] });
  });

  test('a run of a template alone is recorded from that template, with its players as saved', () => {
    const run = startedRun({ ...TEMPLATE, id: 'sunday' }, undefined, 'r2', 9);
    expect(run.source).toEqual({ sessionId: 'sunday', sessionName: 'Sunday run', overrides: [], match: 'recorded' });
    expect(run.players?.map((player) => [player.name, player.origin])).toEqual([['Drizzt', 'saved'], ['Alice', 'saved']]);
    expect(run.lobbyId).toBeUndefined();
  });
});
