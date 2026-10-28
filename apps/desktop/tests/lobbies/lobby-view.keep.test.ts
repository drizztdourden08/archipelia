/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { mergeLobby } from '../../src/stores/merge-lobby';
import type { SessionTemplate } from '@archipelia/model';
import { joinFacts } from '../../src/views/SessionLobby/behavior/join-facts';
import { joinRows } from '../../src/views/SessionBuilder/behavior/join-rows';
import { newTemplate } from '../../src/views/SessionBuilder/behavior/new-template';
import { resultsFacts } from '../../src/views/SessionLobby/behavior/results-facts';
import { serverNotice } from '../../src/views/SessionLobby/behavior/server-notice';
import type { SessionPlace } from '../../src/views/SessionBuilder/SessionBuilder.type';
import { consentOptions } from '../../src/views/LobbyMembers/behavior/consent-options';
import { memberActions } from '../../src/views/LobbyMembers/behavior/member-actions';
import { pendingWorlds } from '../../src/views/LobbyMembers/behavior/pending-worlds';
import { trustTag } from '../../src/views/LobbyMembers/behavior/trust-tag';
import { lobby, member, slot, world } from './lobby-fixtures';

describe('what the session lets the host do with a connected player', () => {
  test('lets the host approve or refuse a waiting player and remove an approved one', () => {
    expect(memberActions(lobby(), member())).toEqual({ approve: true, refuse: true, remove: false });
    expect(memberActions(lobby(), member({ admission: 'approved' }))).toEqual({ approve: false, refuse: false, remove: true });
    expect(memberActions(lobby(), member({ admission: 'approved', kind: 'host' })).remove).toBe(false);
    expect(memberActions(lobby({ phase: 'hosting' }), member())).toEqual({ approve: false, refuse: false, remove: false });
  });
});

describe('the How players join section of the setup page', () => {
  const noop = () => undefined;
  const rowsOf = (draft: SessionTemplate, place: SessionPlace = 'local', live = false) => joinRows({
    draft, directWorlds: [], worlds: null, live, place, placeOptions: [], remoteOptions: [], remoteValue: 'gg', busy: false, password: null,
    onPlace: noop, onRemote: noop, onPort: noop, onAllow: noop, onOptions: noop,
  });
  const local = newTemplate('t1');

  test('holds only configuration: Where, the port or the server, the switch and the room password', () => {
    expect(rowsOf(local).map((row) => row.id)).toEqual(['where', 'port', 'allow', 'password']);
    expect(rowsOf({ ...local, host: { kind: 'archipelago-gg' } }, 'remote').map((row) => row.id)).toEqual(['where', 'server', 'allow', 'password']);
  });

  test('offers Host approval on and unlisted clients off once direct connections are on, with nothing running', () => {
    const rows = rowsOf({ ...local, direct: { admission: 'host-approval', allowUnlisted: false } });
    expect(rows.map((row) => row.id)).toEqual(['where', 'port', 'allow', 'approval', 'unlisted', 'password']);
    expect(rows.map((row) => ('input' in row && row.input?.kind === 'toggle' ? row.input.value : null))).toEqual([null, null, true, true, false, null]);
  });

  test('says who can join from Where, explains a remote host it cannot use, and locks the switch while the lobby is open', () => {
    const allowOf = (draft: SessionTemplate, place: SessionPlace = 'local', live = false) => rowsOf(draft, place, live).find((row) => row.id === 'allow');
    expect(allowOf(local)).toMatchObject({ hint: expect.stringContaining('this computer') as string, lock: null });
    expect(allowOf({ ...local, lan: true }, 'lan')).toMatchObject({ hint: expect.stringContaining('your network') as string });
    const gg = { ...local, host: { kind: 'archipelago-gg' as const } };
    expect(allowOf(gg, 'remote')).toMatchObject({ disabled: true });
    expect(allowOf({ ...gg, direct: { admission: 'open', allowUnlisted: false } }, 'remote')).toMatchObject({ disabled: false, problem: expect.stringContaining('do not work') as string });
    expect(allowOf(local, 'local', true)?.lock).toContain('Close the lobby');
  });

  test('shows the session code with a copy button, the server address and the Archipelago version', () => {
    const facts = joinFacts(lobby(), '127.0.0.1:38290');
    expect(facts.map((fact) => fact.label)).toEqual(['Session code', 'Server address', 'Archipelago version']);
    expect(facts[0]).toMatchObject({ value: 'K7QM-4XT2', copyable: 'session code' });
    expect(joinFacts(lobby(), null).map((fact) => fact.label)).toEqual(['Session code', 'Archipelago version']);
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

  test('lists the room and its files once the lobby has started', () => {
    const hosting = lobby({ room: { seed: 'S1', zip: 'z', host: '10.0.0.5', port: 38281, tls: 'no', files: [], state: 'hosting', roomUrl: 'https://x.test/room' } });
    expect(resultsFacts(hosting, false).map((fact) => fact.label)).toEqual(['Room address', 'Room state', 'Seed', 'Connection', 'Room page']);
    expect(resultsFacts(lobby(), false)).toEqual([]);
    expect(resultsFacts(hosting, true).map((fact) => fact.label)).toEqual(['Room address', 'On this computer', 'Room state', 'Seed', 'Connection', 'Room page']);
    expect(resultsFacts(hosting, true)[1]).toMatchObject({ value: '127.0.0.1:38281' });
  });
});

describe('the lobby of a session', () => {
  test('warns only for the server on this computer, and only when it does not listen', () => {
    const status = { state: 'failed', options: { mode: 'lan', publicLookup: true }, automation: false, roomPasswords: 'vault', lanAddress: '1.2.3.4' } as const;
    expect(serverNotice(true, status)).toContain('not running');
    expect(serverNotice(true, { ...status, state: 'starting' })).toContain('starting');
    expect(serverNotice(true, { ...status, state: 'listening' })).toBeNull();
    expect(serverNotice(true, { ...status, state: 'listening', roomPasswords: 'memory' })).toContain('memory only');
    expect(serverNotice(false, status)).toBeNull();
  });

  test('keeps the newer revision when a late event arrives', () => {
    const newer = lobby({ rev: 3, name: 'New' });
    expect(mergeLobby([newer], lobby({ rev: 2, name: 'Old' }))[0]?.name).toBe('New');
    expect(mergeLobby([newer], lobby({ rev: 4, name: 'Newest' }))[0]?.name).toBe('Newest');
    expect(mergeLobby(undefined, newer)).toEqual([newer]);
  });
});
