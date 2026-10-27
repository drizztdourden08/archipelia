/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { templateOf } from '../src';
import { beforeTheSplit, withLegacyDirect } from './old-records';

describe('a saved session read from disk', () => {
  test('keeps its players and marks each one as hosted by the host setup', () => {
    const read = templateOf(beforeTheSplit());
    expect(read.players.map((player) => [player.name, player.direct])).toEqual([['Drizzt', false], ['Alice', false]]);
    expect(read.players[0]).toMatchObject({ slot: 1, game: 'Hollow Knight', source: { kind: 'preset', presetId: 'easy' } });
    expect(read.lan).toBe(true);
  });

  test('keeps a direct seat as it was saved', () => {
    const stored = { ...beforeTheSplit(), players: [{ slot: 1, name: 'Alice', game: 'Celeste', source: { kind: 'yaml' as const, fileName: 'a.yaml', yaml: 'game: Celeste' }, direct: true }] };
    expect(templateOf(stored).players[0]?.direct).toBe(true);
  });

  test('moves the lobby out of a direct connection (the PR 46 shape) and keeps the admission settings', () => {
    const read = templateOf(withLegacyDirect());
    expect(read.lobby).toEqual({ serverId: 'r1', lobbyId: 'lb_1' });
    expect(read.direct).toEqual({ admission: 'host-approval', allowUnlisted: false });
  });

  test('reads a migrated session again without changing it', () => {
    const once = templateOf(withLegacyDirect());
    expect(templateOf(once)).toEqual(once);
  });
});
