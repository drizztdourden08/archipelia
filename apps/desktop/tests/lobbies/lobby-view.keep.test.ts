/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import type { LobbyServerEntry } from '@archipelia/model';
import { mergeLobby } from '../../src/stores/merge-lobby';
import { consentOptions } from '../../src/views/LobbyDetail/behavior/consent-options';
import { lobbyActions } from '../../src/views/LobbyDetail/behavior/lobby-actions';
import { memberActions } from '../../src/views/LobbyDetail/behavior/member-actions';
import { pendingWorlds } from '../../src/views/LobbyDetail/behavior/pending-worlds';
import { readySlotCount } from '../../src/views/LobbyDetail/behavior/ready-slot-count';
import { resultsFacts } from '../../src/views/LobbyDetail/behavior/results-facts';
import { roomText } from '../../src/views/LobbyDetail/behavior/room-text';
import { trustTag } from '../../src/views/LobbyDetail/behavior/trust-tag';
import { usedSlotCount } from '../../src/views/LobbyDetail/behavior/used-slot-count';
import { serverNotice } from '../../src/views/LobbyList/behavior/server-notice';
import { serverOptions } from '../../src/views/LobbyList/behavior/server-options';
import { waitingCount } from '../../src/views/LobbyList/behavior/waiting-count';
import { lobby, member, slot, world } from './lobby-fixtures';

describe('what a lobby lets the host do', () => {
  test('offers lock, start and close while the lobby is open, and blocks start until a slot is ready', () => {
    expect(lobbyActions(lobby())).toMatchObject({ lock: true, start: true, close: true, stopRoom: false });
    expect(lobbyActions(lobby()).startBlock).toContain('No slot is ready');
    const ready = lobby({ members: [member({ admission: 'approved' })] });
    expect(readySlotCount(ready)).toBe(1);
    expect(lobbyActions(ready).startBlock).toBeNull();
  });

  test('stops offering lock and start once the room hosts, and offers to stop the room', () => {
    const hosting = lobby({ phase: 'hosting', room: { seed: 's', zip: 'z', host: 'h', port: 1, tls: 'no', files: [], state: 'hosting' } });
    expect(lobbyActions(hosting)).toMatchObject({ lock: false, start: false, stopRoom: true });
    expect(lobbyActions(lobby({ phase: 'closed' })).close).toBe(false);
    expect(lobbyActions(lobby({ phase: 'failed' })).start).toBe(true);
  });

  test('lets the host approve or refuse a waiting player and remove an approved one', () => {
    expect(memberActions(lobby(), member())).toEqual({ approve: true, refuse: true, remove: false });
    expect(memberActions(lobby(), member({ admission: 'approved' }))).toEqual({ approve: false, refuse: false, remove: true });
    expect(memberActions(lobby(), member({ admission: 'approved', kind: 'host' })).remove).toBe(false);
    expect(memberActions(lobby({ phase: 'hosting' }), member())).toEqual({ approve: false, refuse: false, remove: false });
  });

  test('counts used slots like the server: a client holds at least one', () => {
    const many = lobby({ members: [member({ slots: [] }), member({ id: 'm_2', slots: [slot(), slot({ name: 'B' })] }), member({ id: 'm_3', admission: 'refused' })] });
    expect(usedSlotCount(many)).toBe(3);
    expect(waitingCount(many)).toBe(2);
  });
});

describe('the members and the consent dialog', () => {
  test('tags a verified client as registered and an unlisted one as unlisted', () => {
    expect(trustTag(member({ trust: 'verified' })).text).toBe('Registered and verified');
    expect(trustTag(member()).text).toBe('Unlisted');
  });

  test('finds the worlds that wait for consent and builds a danger dialog that focuses Refuse', () => {
    const waiting = lobby({ members: [member({ admission: 'approved', slots: [slot({ state: 'waiting-consent', worldSha256: 'w1' })] })] });
    const [request] = pendingWorlds(waiting, waiting.members[0] ?? member());
    expect(request?.world.sha256).toBe('w1');
    const options = request ? consentOptions(request, 'this computer') : undefined;
    expect(options).toMatchObject({ variant: 'danger', cancelLabel: 'Refuse', confirmLabel: 'Allow this world' });
    expect(options?.message).toContain('with your user rights');
    expect(options?.message).toContain('trust Zelda');
    expect(options?.facts?.map((fact) => fact.label)).toEqual(['Game', 'World version', 'Size', 'Hash', 'Sent by', 'Client', 'Check']);
    expect(pendingWorlds(lobby(), member())).toEqual([]);
  });

  test('shows the note of the server about its sandbox in place of the default sentence', () => {
    const request = { lobby: lobby(), member: member(), slot: slot(), world: world({ consentNote: 'It runs in a sandbox on this server.' }) };
    const { message } = consentOptions(request, 'this computer');
    expect(message).toContain('It runs in a sandbox on this server. Allow it only');
    expect(message).not.toContain('user rights');
  });

  test('describes where the room runs', () => {
    expect(roomText({ kind: 'local', port: 38281 })).toContain('38281');
    expect(roomText({ kind: 'archipelago-gg' })).toBe('archipelago.gg');
    expect(roomText({ kind: 'remote', serverId: 's1' }, 'Home box')).toBe('Remote server Home box');
  });

  test('lists the room and its files once the lobby has started', () => {
    const hosting = lobby({ room: { seed: 'S1', zip: 'z', host: '10.0.0.5', port: 38281, tls: 'no', files: [], state: 'hosting', roomUrl: 'https://x.test/room' } });
    expect(resultsFacts(hosting).map((fact) => fact.label)).toEqual(['Room address', 'Room state', 'Seed', 'Connection', 'Room page']);
    expect(resultsFacts(lobby())).toEqual([]);
  });
});

describe('the lobby list', () => {
  const entries: LobbyServerEntry[] = [{ id: 'r1', label: 'VPS', url: 'wss://vps.test', tokenRef: 't' }];

  test('offers this computer first, then each saved server', () => {
    expect(serverOptions(entries)).toEqual([{ value: 'local', label: 'This computer' }, { value: 'r1', label: 'VPS' }]);
  });

  test('warns only for the server on this computer, and only when it does not listen', () => {
    const status = { state: 'failed', options: { mode: 'lan', publicLookup: true }, automation: false, lanAddress: '1.2.3.4' } as const;
    expect(serverNotice(true, status)).toContain('not running');
    expect(serverNotice(true, { ...status, state: 'starting' })).toContain('starting');
    expect(serverNotice(true, { ...status, state: 'listening' })).toBeNull();
    expect(serverNotice(false, status)).toBeNull();
  });

  test('keeps the newer revision when a late event arrives', () => {
    const newer = lobby({ rev: 3, name: 'New' });
    expect(mergeLobby([newer], lobby({ rev: 2, name: 'Old' }))[0]?.name).toBe('New');
    expect(mergeLobby([newer], lobby({ rev: 4, name: 'Newest' }))[0]?.name).toBe('Newest');
    expect(mergeLobby(undefined, newer)).toEqual([newer]);
  });
});
