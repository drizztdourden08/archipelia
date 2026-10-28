/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import type { LobbyServerEntry } from '@archipelia/model';
import { formatPin } from '../../src/lobbies/format-pin';
import { isPin } from '../../src/lobbies/is-pin';
import type { LanEntry, LobbyServerStatus } from '../../src/lobbies/lobbies.type';
import { normalizePin } from '../../src/lobbies/normalize-pin';
import { parseServerUrl } from '../../src/lobbies/parse-server-url';
import { serverPlace } from '../../src/lobbies/server-place';
import { draftProblems } from '../../src/views/ArchipeliaServers/behavior/draft-problems';
import { entryStatus } from '../../src/lobbies/entry-status';
import { lanRows } from '../../src/views/ArchipeliaServers/behavior/lan-rows';
import { networkRows } from '../../src/views/ArchipeliaServers/behavior/network-rows';
import { newEntry } from '../../src/views/ArchipeliaServers/behavior/new-entry';
import { reachFacts } from '../../src/views/ArchipeliaServers/behavior/reach-facts';
import { remoteFacts } from '../../src/views/ArchipeliaServers/behavior/remote-facts';
import { inputOf } from './row-parts';

const PIN = 'ab'.repeat(32);

const status = (patch: Partial<LobbyServerStatus> = {}): LobbyServerStatus => ({
  state: 'listening', options: { mode: 'lan', publicLookup: true }, automation: false, roomPasswords: 'vault', lanAddress: '192.168.1.5', port: 38290, secure: false, ...patch,
});

const lan = (patch: Partial<LanEntry> = {}): LanEntry => ({
  name: 'Friday server', id: 'srv_1', protocol: 1, ap: '0.6.7', open: true, host: '192.168.1.9', port: 38290, compatible: true, via: ['mdns'], self: false, ...patch,
});

const labels = (facts: { label: string }[]) => facts.map((fact) => fact.label);

describe('the server addresses and pins', () => {
  test('reads ws and wss addresses with the default port of the lobby', () => {
    expect(parseServerUrl('ws://127.0.0.1')).toEqual({ secure: false, host: '127.0.0.1', port: 38290 });
    expect(parseServerUrl(' wss://play.example.net:443 ')).toEqual({ secure: true, host: 'play.example.net', port: 443 });
    expect(parseServerUrl('wss://[::1]:4000')).toEqual({ secure: true, host: '::1', port: 4000 });
    expect(parseServerUrl('https://play.example.net')).toBeNull();
    expect(parseServerUrl('play.example.net')).toBeNull();
    expect(parseServerUrl('ws://host:0')).toBeNull();
  });

  test('accepts a pin with colons and capitals and shows it in groups', () => {
    const typed = formatPin(PIN);
    expect(typed.startsWith('AB:AB:')).toBe(true);
    expect(normalizePin(typed)).toBe(PIN);
    expect(isPin(typed)).toBe(true);
    expect(isPin('abc')).toBe(false);
  });

  test('puts the address players join at on each server', () => {
    const entry: LobbyServerEntry = { id: 'r1', label: 'VPS', url: 'wss://vps.test:5000', tokenRef: 't' };
    expect(serverPlace('local', [], status())).toMatchObject({ local: true, address: '192.168.1.5:38290', where: 'this computer' });
    expect(serverPlace('local', [], status({ automation: true })).address).toBe('127.0.0.1:38290');
    expect(serverPlace('local', [], status({ options: { mode: 'off', publicLookup: true } })).address).toBe('127.0.0.1:38290');
    expect(serverPlace('local', [], null).address).toBeNull();
    expect(serverPlace('r1', [entry], null)).toMatchObject({ local: false, label: 'VPS', address: 'vps.test:5000' });
  });
});

describe('the remote server form', () => {
  test('asks for a label, an address, a token and a valid pin', () => {
    const fields = (draft: Parameters<typeof draftProblems>[0]) => draftProblems(draft).map((problem) => problem.field);
    expect(fields({ label: '', url: 'nope', token: '', pin: 'zz' })).toEqual(['label', 'url', 'token', 'pin']);
    expect(fields({ label: 'VPS', url: 'wss://vps.test', token: 't', pin: '' })).toEqual([]);
  });

  test('saves a pin in its plain form and leaves the token out of the entry', () => {
    const entry = newEntry({ label: ' VPS ', url: ' wss://vps.test ', token: 'secret', pin: formatPin(PIN) });
    expect(entry).toEqual({ id: '', label: 'VPS', url: 'wss://vps.test', tokenRef: '', certSha256: PIN });
    expect(JSON.stringify(entry)).not.toContain('secret');
    expect(newEntry({ label: 'A', url: 'ws://a', token: 't', pin: '' })).not.toHaveProperty('certSha256');
  });

  test('reads the state of a server from its last test', () => {
    const base: LobbyServerEntry = { id: 'r1', label: 'VPS', url: 'wss://vps.test', tokenRef: 't' };
    expect(entryStatus(base).text).toBe('Not tested');
    expect(entryStatus({ ...base, lastTest: { at: 1, ok: true, message: 'ok' } }).tone).toBe('success');
    expect(entryStatus({ ...base, lastTest: { at: 1, ok: false, message: 'no' } }).tone).toBe('danger');
  });

  test('shows the pin and the answer of the server', () => {
    const entry: LobbyServerEntry = { id: 'r1', label: 'VPS', url: 'wss://vps.test', tokenRef: 't', certSha256: PIN };
    const facts = remoteFacts(entry, { ok: true, message: 'Connected', info: { name: 'Archipelia', version: '0.2.0', port: 1, sandbox: 'none', tls: true } });
    expect(labels(facts)).toEqual(['Address', 'Certificate pin', 'Server', 'Lobby TLS', 'Last test']);
    expect(labels(remoteFacts({ ...entry, certSha256: undefined }, undefined))).toEqual(['Address', 'Certificate pin']);
  });
});

describe('the server on this computer', () => {
  test('lists the reach of a listening server and says the lobby is LAN-only until TLS', () => {
    const facts = reachFacts(status(), {});
    expect(labels(facts)).toEqual(['Lobby address', 'Network mode', 'Seen on your network', 'Router port', 'Public address check', 'TLS']);
    expect(facts.find((fact) => fact.label === 'TLS')?.value).toContain('LAN-only until the server has TLS');
    expect(facts[0]?.value).toBe('192.168.1.5:38290');
    expect(reachFacts(status({ state: 'failed', port: undefined }), {})).toEqual([]);
  });

  test('passes on what the router and the public address check reported, with the name of each room', () => {
    const reach = { mode: 'lan-and-internet', advertising: true, lobbyPort: 'Port 38290 opened on your router (upnp).', publicAddress: 'The public address check ran.', rooms: { lb_1: 'Port 38281 opened.' }, cgnat: null } as const;
    const facts = reachFacts(status({ options: { mode: 'lan-and-internet', publicLookup: true }, secure: true, reach }), { lb_1: 'Friday seed' });
    expect(facts.find((fact) => fact.label === 'Router port')?.value).toContain('opened on your router');
    expect(facts.find((fact) => fact.label === 'Seen on your network')?.value).toContain('Yes');
    expect(facts.find((fact) => fact.label === 'Room of Friday seed')?.value).toBe('Port 38281 opened.');
    expect(facts.find((fact) => fact.label === 'TLS')?.value).toBe('On');
  });

  test('explains why the server is not seen when the mode is off or the launch is automated', () => {
    const seen = (patch: Partial<LobbyServerStatus>) => reachFacts(status(patch), {}).find((fact) => fact.label === 'Seen on your network')?.value;
    expect(seen({ options: { mode: 'off', publicLookup: true } })).toContain('mode is Off');
    expect(seen({ automation: true })).toContain('automated');
  });

  test('offers the three modes and the public address check as rows', () => {
    const applied: unknown[] = [];
    const rows = networkRows({ mode: 'lan', publicLookup: true }, false, (patch) => applied.push(patch));
    expect(rows.map((row) => row.title)).toEqual(['Network mode', 'Look up my public address']);
    const mode = inputOf(rows[0]);
    if (mode?.kind === 'segmented') {
      expect(mode.options.map((option) => option.value)).toEqual(['lan', 'lan-and-internet', 'off']);
      mode.onChange('off');
      mode.onChange('nonsense');
    }
    const lookup = inputOf(rows[1]);
    if (lookup?.kind === 'toggle') lookup.onChange(false);
    expect(applied).toEqual([{ mode: 'off' }, { publicLookup: false }]);
  });
});

describe('the servers found on the network', () => {
  test('says whether each one runs the version of the engine, with this computer first', () => {
    const rows = lanRows([lan({ id: 'b', name: 'Zed', ap: '0.6.8' }), lan({ id: 'a', name: 'Alpha' }), lan({ id: 's', name: 'Mine', self: true })], '0.6.7');
    expect(rows.map((row) => [row.name, row.match])).toEqual([['Mine', 'same'], ['Alpha', 'same'], ['Zed', 'different']]);
    expect(lanRows([lan()], undefined)[0]?.match).toBe('unknown');
    expect(lanRows([lan()], '0.6.7')[0]).toMatchObject({ address: '192.168.1.9:38290', open: true });
  });
});
