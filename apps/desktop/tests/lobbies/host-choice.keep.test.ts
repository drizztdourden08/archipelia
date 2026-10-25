/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import type { GamePreset, InstalledGame } from '@archipelia/model';
import { joinAddress } from '../../src/lobbies/join-address';
import type { LobbyServerStatus } from '../../src/lobbies/lobbies.type';
import { lobbyRequest } from '../../src/lobbies/lobby-request';
import { chooseWhere } from '../../src/views/HostChoice/behavior/choose-where';
import { yourNetwork } from '../../src/views/HostChoice/behavior/your-network';
import { networkFacts } from '../../src/views/HostChoice/behavior/network-facts';
import { privateFacts } from '../../src/views/HostChoice/behavior/private-facts';
import { whereOptions } from '../../src/views/HostChoice/behavior/where-options';
import { hostSlotOf } from '../../electron/sessions/host-slot-of';

const LISTENING: LobbyServerStatus = {
  state: 'listening', options: { mode: 'lan', publicLookup: true }, automation: false, roomPasswords: 'vault', lanAddress: '192.168.1.5', port: 38290, secure: false,
};

const status = (patch: Partial<LobbyServerStatus> = {}): LobbyServerStatus => ({ ...LISTENING, ...patch });

describe('where to host', () => {
  test('reads the choice from the server picked and the network mode', () => {
    expect(chooseWhere('local', false, status({ options: { mode: 'off', publicLookup: true } }))).toBe('private');
    expect(chooseWhere('local', false, status())).toBe('lan');
    expect(chooseWhere('local', false, status({ options: { mode: 'lan-and-internet', publicLookup: true } }))).toBe('lan');
    expect(chooseWhere('local', false, null)).toBe('private');
    expect(chooseWhere('r1', false, status())).toBe('remote');
    expect(chooseWhere('local', true, status())).toBe('remote');
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

  test('keeps the server of a session with a lobby: the other kind of place is off, with the reason', () => {
    expect(whereOptions(undefined).every((option) => !option.disabled)).toBe(true);
    expect(whereOptions('local').map((option) => Boolean(option.disabled))).toEqual([false, false, true]);
    expect(whereOptions('srv_1').map((option) => Boolean(option.disabled))).toEqual([true, true, false]);
  });
});
