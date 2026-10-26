/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import type { GamePreset, InstalledGame, LobbyServerEntry, ServerEntry, SessionTemplate } from '@archipelia/model';
import type { SettingsOption } from '@drizztdourden08/tessera/composites';
import { joinAddress } from '../../src/lobbies/join-address';
import type { LobbyServerStatus } from '../../src/lobbies/lobbies.type';
import { lobbyRequest } from '../../src/lobbies/lobby-request';
import { sessionReach } from '../../src/lobbies/session-reach';
import { hostingDefaults } from '../../src/views/SessionBuilder/behavior/hosting-defaults';
import { newTemplate } from '../../src/views/SessionBuilder/behavior/new-template';
import { placeOf } from '../../src/views/SessionBuilder/behavior/place-of';
import { placeOptions } from '../../src/views/SessionBuilder/behavior/place-options';
import { remoteOptions } from '../../src/views/SessionBuilder/behavior/remote-options';
import { remoteValue } from '../../src/views/SessionBuilder/behavior/remote-value';
import { withPlace } from '../../src/views/SessionBuilder/behavior/with-place';
import { withRemote } from '../../src/views/SessionBuilder/behavior/with-remote';
import { yourNetwork } from '../../src/views/SessionLobby/behavior/your-network';
import { networkFacts } from '../../src/views/SessionLobby/behavior/network-facts';
import { privateFacts } from '../../src/views/SessionLobby/behavior/private-facts';
import { roomFacts } from '../../src/views/SessionLobby/behavior/room-facts';
import { hostSlotOf } from '../../electron/sessions/host-slot-of';
import { DEFAULT_SETTINGS } from '../../src/settings.constants';

const LISTENING: LobbyServerStatus = {
  state: 'listening', options: { mode: 'lan', publicLookup: true }, automation: false, roomPasswords: 'vault', lanAddress: '192.168.1.5', port: 38290, secure: false,
};

const status = (patch: Partial<LobbyServerStatus> = {}): LobbyServerStatus => ({ ...LISTENING, ...patch });

const LOCAL = newTemplate('t1');

const DIRECT = { admission: 'host-approval', allowUnlisted: false } as const;

const LAN: SessionTemplate = { ...LOCAL, lan: true };

const ON_FRIEND: SessionTemplate = { ...LOCAL, lobby: { serverId: 'r1', lobbyId: 'lb_1' }, direct: DIRECT };

const FRIEND: LobbyServerEntry = { id: 'r1', label: 'Friend', url: 'wss://friend.example:38290', tokenRef: 'token' };

const BOX = { id: 's1', label: 'Box', host: '192.0.2.10', gamePort: 38281 } as ServerEntry;

const HOSTING = hostingDefaults(DEFAULT_SETTINGS);

const CONTEXT = { lobbyServers: [FRIEND], servers: [BOX], hosting: HOSTING };

const offs = (options: readonly SettingsOption[]) => options.map((option) => Boolean(option.disabled));

describe('where a session lives', () => {
  test('reads Local, LAN or Remote from the session alone, never from the network mode or direct connections', () => {
    expect(placeOf(LOCAL)).toBe('local');
    expect(placeOf({ ...LOCAL, direct: DIRECT })).toBe('local');
    expect(placeOf(LAN)).toBe('lan');
    expect(placeOf({ ...LAN, direct: DIRECT })).toBe('lan');
    expect(placeOf({ ...LOCAL, host: { kind: 'archipelago-gg' } })).toBe('remote');
    expect(placeOf({ ...LOCAL, host: { kind: 'remote', serverId: 's1' } })).toBe('remote');
    expect(placeOf(ON_FRIEND)).toBe('remote');
    expect(sessionReach(ON_FRIEND)).toBe('archipelia');
  });

  test('offers LAN without direct connections, and locks Where while the lobby is open', () => {
    expect(offs(placeOptions({ draft: LOCAL, lobbyServers: [], live: false }))).toEqual([false, false, false]);
    expect(offs(placeOptions({ draft: { ...LOCAL, direct: DIRECT }, lobbyServers: [], live: false }))).toEqual([false, false, true]);
    expect(offs(placeOptions({ draft: { ...LOCAL, direct: DIRECT }, lobbyServers: [FRIEND], live: false }))).toEqual([false, false, false]);
    expect(offs(placeOptions({ draft: LOCAL, lobbyServers: [FRIEND], live: true }))).toEqual([true, true, true]);
  });

  test('never changes Where when direct connections change, and keeps them when Where changes', () => {
    const lan = withPlace({ ...LOCAL, direct: DIRECT }, 'lan', CONTEXT);
    expect(lan).toMatchObject({ lan: true, direct: DIRECT, host: { kind: 'local' } });
    expect(withPlace(lan, 'local', CONTEXT).lan).toBeUndefined();
    expect(withPlace(LOCAL, 'remote', CONTEXT).host).toEqual({ kind: 'remote', serverId: 's1' });
    expect(withPlace({ ...LOCAL, direct: DIRECT }, 'remote', CONTEXT)).toMatchObject({ lobby: { serverId: 'r1' }, direct: DIRECT });
    expect(withRemote(LOCAL, 'lobby:r1', HOSTING)).toMatchObject({ lobby: { serverId: 'r1' }, host: { kind: 'local' } });
    expect(withRemote(ON_FRIEND, 'gg', HOSTING).lobby).toBeUndefined();
  });

  test('lists archipelago.gg, the machines over SSH and the Archipelia servers, each with what it needs', () => {
    const labels = remoteOptions({ draft: LOCAL, lobbyServers: [FRIEND], servers: [BOX] });
    expect(labels.map((option) => option.label)).toEqual(['archipelago.gg', 'Box over SSH', 'Friend, an Archipelia server']);
    expect(offs(labels)).toEqual([false, false, false]);
    expect(offs(remoteOptions({ draft: ON_FRIEND, lobbyServers: [FRIEND], servers: [BOX] }))).toEqual([true, true, false]);
    expect(remoteValue({ ...LOCAL, host: { kind: 'archipelago-gg' } })).toBe('gg');
    expect(remoteValue({ ...LOCAL, host: { kind: 'remote', serverId: 's1' } })).toBe('ssh:s1');
    expect(remoteValue(ON_FRIEND)).toBe('lobby:r1');
  });

  test('shows the room addresses of a LAN session to copy, and none for a local one', () => {
    expect(roomFacts(LAN, status()).map((fact) => fact.value)).toEqual(['192.168.1.5:38281', '127.0.0.1:38281']);
    expect(roomFacts(LOCAL, status())).toEqual([]);
    expect(roomFacts(LAN, null)).toEqual([]);
  });

  test('shows both addresses of a server on the network, each to copy', () => {
    const facts = networkFacts(status({ reach: { mode: 'lan', advertising: true, lobbyPort: null, publicAddress: null, rooms: {}, cgnat: null } }));
    expect(facts.map((fact) => fact.label)).toEqual(['This computer', 'Your network', 'Announced on your network']);
    expect(facts[0]).toMatchObject({ value: '127.0.0.1:38290', copyable: expect.any(String) as string });
    expect(facts[1]).toMatchObject({ value: '192.168.1.5:38290', copyable: expect.any(String) as string });
    expect(facts[2]?.value).toContain('Yes');
    expect(yourNetwork(status())).toBe('192.168.1.5:38290');
  });

  test('says it is not announced before the announcement runs, and shows no address without a port', () => {
    expect(networkFacts(status())[2]?.value).toBe('Not yet.');
    const closed = status({ state: 'failed' });
    const { port: _port, ...noPort } = closed;
    expect(networkFacts(noPort)).toEqual([]);
    expect(privateFacts(noPort)).toEqual([]);
    expect(privateFacts(status({ options: { mode: 'off', publicLookup: true } })).map((fact) => fact.value)).toEqual(['127.0.0.1:38290']);
  });
});

describe('the address of a lobby to join', () => {
  test('accepts a bare host on the private network, with or without a port', () => {
    expect(joinAddress('192.168.1.20:38290')).toEqual({ target: { secure: false, host: '192.168.1.20', port: 38290 } });
    expect(joinAddress('192.168.1.20')).toEqual({ target: { secure: false, host: '192.168.1.20', port: 38290 } });
    expect(joinAddress('localhost:4000')).toEqual({ target: { secure: false, host: 'localhost', port: 4000 } });
    expect(joinAddress('ws://10.0.0.4:38290')).toEqual({ target: { secure: false, host: '10.0.0.4', port: 38290 } });
  });

  test('reaches a computer outside the network only through TLS', () => {
    expect(joinAddress('play.example.net:38290')).toEqual({ target: { secure: true, host: 'play.example.net', port: 38290 } });
    expect(joinAddress('wss://play.example.net')).toEqual({ target: { secure: true, host: 'play.example.net', port: 38290 } });
    expect(joinAddress('ws://play.example.net:38290')).toHaveProperty('problem');
  });

  test('names a problem for an empty or wrong address', () => {
    expect(joinAddress('')).toHaveProperty('problem');
    expect(joinAddress('192.168.1.20:99999')).toHaveProperty('problem');
    expect(joinAddress('http://192.168.1.20')).toHaveProperty('problem');
  });
});

describe('the players and the place of a session with direct connection', () => {
  const game = {
    apworld: 'zelda', game: 'A Link to the Past', version: '1', source: 'official', installedAt: 0, sha256: 'x', verified: true, layout: 'folder', path: 'p', requires: [],
    schema: { game: 'A Link to the Past', worldVersion: '1.0.0', groups: [], presets: {}, options: [{ key: 'death_link', displayName: 'Death link', group: 'g', kind: 'toggle', description: '', default: false, visibility: ['simple'], weightable: false }] },
  } as InstalledGame;
  const preset = { id: 'p1', game: 'A Link to the Past', name: 'Hard', values: { death_link: true }, updatedAt: 0 } as GamePreset;

  const slotOf = hostSlotOf(() => Promise.resolve([game]), { get: (id) => Promise.resolve(id === preset.id ? preset : null) });

  test('builds the slot of a player of the session from its preset', async () => {
    const slot = await slotOf({ slot: 1, name: 'Ana', game: 'A Link to the Past', source: { kind: 'preset', presetId: 'p1', overrides: {} } });
    expect(slot).toMatchObject({ name: 'Ana', game: 'A Link to the Past', worldVersion: '1.0.0' });
    expect(slot.yaml).toContain('name: Ana');
    expect(slot.yaml).toContain('death_link: true');
    await expect(slotOf({ slot: 2, name: 'Bo', game: 'Other', source: { kind: 'preset', presetId: 'p1', overrides: {} } })).rejects.toThrow('Other is not installed');
  });

  test('sends the players of the session through the admin request member.host', async () => {
    const slots = [await slotOf({ slot: 1, name: 'Ana', game: 'A Link to the Past', source: { kind: 'preset', presetId: 'p1', overrides: {} } })];
    expect(lobbyRequest.host('lb1', 'Host', slots)).toEqual({ type: 'member.host', params: { lobbyId: 'lb1', displayName: 'Host', slots } });
  });
});
