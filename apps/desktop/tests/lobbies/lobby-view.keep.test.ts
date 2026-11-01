/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { mergeLobby } from '../../src/stores/merge-lobby';
import { joinFacts } from '../../src/views/SessionLobby/behavior/join-facts';
import { directState } from '../../src/views/SessionBuilder/behavior/direct-state';
import { newTemplate } from '../../src/views/SessionBuilder/behavior/new-template';
import { serverNotice } from '../../src/views/SessionLobby/behavior/server-notice';
import { consentOptions } from '../../src/views/LobbyMembers/behavior/consent-options';
import { memberActions } from '../../src/views/LobbyMembers/behavior/member-actions';
import { pendingWorlds } from '../../src/views/LobbyMembers/behavior/pending-worlds';
import { lobby, member, slot, world } from './lobby-fixtures';

describe('K4 what the session lets the host do with a connected player', { tags: ['critical'] }, () => {
  test('lets the host approve or refuse a waiting player and remove an approved one', () => {
    expect(memberActions(lobby(), member())).toEqual({ approve: true, refuse: true, remove: false });
    expect(memberActions(lobby(), member({ admission: 'approved' }))).toEqual({ approve: false, refuse: false, remove: true });
    expect(memberActions(lobby(), member({ admission: 'approved', kind: 'host' })).remove).toBe(false);
    expect(memberActions(lobby({ phase: 'hosting' }), member())).toEqual({ approve: false, refuse: false, remove: false });
  });
});

describe('K1 the How players join section of the setup page', { tags: ['critical'] }, () => {
  const local = newTemplate('t1');

  test('keeps Host approval and unlisted clients off until direct connections are on', () => {
    expect(directState(local, false, false)).toMatchObject({ on: false, approval: false, unlisted: false, allowOff: false, optionsOff: true });
    const on = directState({ ...local, direct: { admission: 'host-approval', allowUnlisted: false } }, false, false);
    expect(on).toMatchObject({ on: true, approval: true, unlisted: false, optionsOff: false });
  });

  test('says who can join from Where, explains a remote host it cannot use, and locks the switch while the lobby is open', () => {
    expect(directState(local, false, false).hint).toContain('this computer');
    expect(directState({ ...local, lan: true }, false, false).hint).toContain('your network');
    const gg = { ...local, host: { kind: 'archipelago-gg' as const } };
    expect(directState(gg, false, false)).toMatchObject({ allowOff: true, problem: undefined });
    expect(directState({ ...gg, direct: { admission: 'open', allowUnlisted: false } }, false, false)).toMatchObject({ allowOff: false, problem: expect.stringContaining('do not work') as string });
    expect(directState(local, true, false)).toMatchObject({ allowOff: true, optionsOff: true, hint: expect.stringContaining('Close the lobby') as string });
  });
});

describe('K1 the session tab facts', { tags: ['critical'] }, () => {
  test('shows the session code with a copy button, the server address and the Archipelago version', () => {
    const facts = joinFacts(lobby(), '127.0.0.1:38290');
    expect(facts.map((fact) => fact.label)).toEqual(['Session code', 'Server address', 'Archipelago version']);
    expect(facts[0]).toMatchObject({ value: 'K7QM-4XT2', copyable: 'session code' });
    expect(joinFacts(lobby(), null).map((fact) => fact.label)).toEqual(['Session code', 'Archipelago version']);
  });
});

describe('K4 the members and the consent dialog', { tags: ['critical'] }, () => {
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
});

describe('K1 the lobby of a session', { tags: ['critical'] }, () => {
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
