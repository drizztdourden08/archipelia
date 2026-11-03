/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { templateOf } from '../src';
import type { StoredTemplate } from '../src';
import { beforeTheSplit, withLegacyDirect } from './old-records';

const YAML_SOURCE = { kind: 'yaml' as const, fileName: 'a.yaml', yaml: 'game: Celeste' };

const storedWith = (players: unknown[]): StoredTemplate => ({ ...beforeTheSplit(), players: players as StoredTemplate['players'] });

describe('K3 a saved session read from disk', { tags: ['critical'] }, () => {
  test('keeps its hosted players and reads each one as a set player', () => {
    const read = templateOf(beforeTheSplit());
    expect(read.players.map((player) => [player.kind, player.kind === 'set' ? player.name : ''])).toEqual([['set', 'Drizzt'], ['set', 'Alice']]);
    expect(read.players[0]).toMatchObject({ slot: 1, game: 'Hollow Knight', source: { kind: 'preset', presetId: 'easy' } });
    expect(read.lan).toBe(true);
  });

  test('reads a held seat as a direct player and drops its name', () => {
    const read = templateOf(storedWith([{ slot: 1, name: 'Alice', direct: true }, { slot: 2, direct: true }]));
    expect(read.players).toEqual([{ kind: 'direct', slot: 1 }, { kind: 'direct', slot: 2 }]);
  });

  test('reads a hosted player that fell back to a direct connection as a set player', () => {
    const read = templateOf(storedWith([{ slot: 1, name: 'Alice', game: 'Celeste', source: YAML_SOURCE, direct: true }]));
    expect(read.players).toEqual([{ kind: 'set', slot: 1, name: 'Alice', game: 'Celeste', source: YAML_SOURCE }]);
  });

  test('gives a session with no allowed games an empty list', () => {
    expect(templateOf(withLegacyDirect()).direct?.allowedGames).toEqual([]);
    expect(templateOf(beforeTheSplit()).direct).toBeUndefined();
  });

  test('keeps the allowed games a session was saved with', () => {
    const stored = { ...withLegacyDirect(), direct: { admission: 'open' as const, allowUnlisted: false, allowedGames: ['Celeste'] } };
    expect(templateOf(stored).direct).toEqual({ admission: 'open', allowUnlisted: false, allowedGames: ['Celeste'] });
  });

  test('moves the lobby out of a direct connection (the PR 46 shape) and keeps the admission settings', () => {
    const read = templateOf(withLegacyDirect());
    expect(read.lobby).toEqual({ serverId: 'r1', lobbyId: 'lb_1' });
    expect(read.direct).toEqual({ admission: 'host-approval', allowUnlisted: false, allowedGames: [] });
  });

  test('reads a migrated session again without changing it', () => {
    const once = templateOf(storedWith([{ slot: 1, name: 'Alice', direct: true }, { slot: 2, name: 'Bob', game: 'Celeste', source: YAML_SOURCE }]));
    expect(templateOf(once)).toEqual(once);
    const lobby = templateOf(withLegacyDirect());
    expect(templateOf(lobby)).toEqual(lobby);
  });
});
