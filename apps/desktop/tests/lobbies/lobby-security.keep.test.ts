/* @layer tests @kind test */
import { afterEach, describe, expect, test } from 'vitest';
import type { LobbyServerEntry, ServerEntry } from '@archipelia/model';
import { canonicalServerRefs } from '../../electron/lobbies/canonical-server-refs';
import { createLobbyServerStore } from '../../electron/lobbies/create-lobby-server-store';
import { parseServerOptions } from '../../electron/lobbies/parse-server-options';
import { openRemoteChannel } from '../../electron/lobbies/remote/open-remote-channel';
import { saveLobbyServerEntry } from '../../electron/lobbies/save-lobby-server-entry';
import { testLobbyServer } from '../../electron/lobbies/test-lobby-server';
import { parseServerUrl } from '../../src/lobbies/parse-server-url';
import { tokenSecret } from '../../src/lobbies/token-secret';
import { tempFiles } from './temp-files';

const closers: (() => Promise<void>)[] = [];

const newStore = async () => {
  const { files, remove } = await tempFiles('lobbyServers');
  closers.push(remove);
  return createLobbyServerStore(files);
};

afterEach(async () => {
  await Promise.all(closers.splice(0).map((close) => close()));
});

const entry = (patch: Partial<LobbyServerEntry> = {}): LobbyServerEntry => ({ id: '', label: 'VPS', url: 'wss://vps.example.net', tokenRef: '', ...patch });

describe('K4 the renderer cannot choose which vault secret leaves the app', { tags: ['critical'] }, () => {
  test('derives the token reference from the id and ignores the one the renderer sent', async () => {
    const store = await newStore();
    const saved = await saveLobbyServerEntry(store, entry({ tokenRef: 'gg-owner-id' }));
    expect(saved.tokenRef).toBe(tokenSecret(saved.id));
    const again = await saveLobbyServerEntry(store, { ...saved, label: 'Renamed', tokenRef: 'room-password-secret' });
    expect(again).toMatchObject({ id: saved.id, label: 'Renamed', tokenRef: tokenSecret(saved.id) });
    expect((await store.get(saved.id))?.tokenRef).toBe(tokenSecret(saved.id));
  });

  test('keeps the last test of the server and drops one the renderer sent', async () => {
    const store = await newStore();
    const saved = await saveLobbyServerEntry(store, entry());
    await store.put({ ...saved, lastTest: { at: 1, ok: true, message: 'Connected' } });
    const again = await saveLobbyServerEntry(store, { ...saved, lastTest: { at: 2, ok: false, message: 'forged' } });
    expect(again.lastTest?.message).toBe('Connected');
  });

  test('refuses an id that is not in the list, a plain remote address and a bad pin', async () => {
    const store = await newStore();
    await expect(saveLobbyServerEntry(store, entry({ id: 'made-up' }))).rejects.toThrow('not in the list');
    await expect(saveLobbyServerEntry(store, entry({ url: 'ws://vps.example.net' }))).rejects.toThrow('only for this computer');
    await expect(saveLobbyServerEntry(store, entry({ certSha256: 'abc' }))).rejects.toThrow('64 hexadecimal');
    await expect(saveLobbyServerEntry(store, entry({ label: ' ' }))).rejects.toThrow('label');
    expect(await store.list()).toEqual([]);
  });

  test('reads only the secret named after the id, whatever reference a stored entry holds', async () => {
    const store = await newStore();
    await store.put(entry({ id: 'abc', tokenRef: 'gg-owner-id' }));
    const asked: string[] = [];
    const secrets = { get: (name: string) => { asked.push(name); return Promise.resolve(null); } };
    const result = await testLobbyServer(store, secrets, 'abc');
    expect(result.ok).toBe(false);
    expect(asked).toEqual([tokenSecret('abc')]);
  });

  test('gives every secret reference of a saved SSH server its own name', () => {
    const base = { id: '', label: 'Box', host: 'h', port: 22, gamePort: 38281, apPath: '/opt/ap' } satisfies Partial<ServerEntry>;
    const password = canonicalServerRefs({ ...base, auth: { kind: 'ssh-password', username: 'u', passwordRef: 'gg-owner-id' } });
    expect(password.auth).toMatchObject({ passwordRef: `server-${password.id}-password` });
    const none = canonicalServerRefs({ ...base, id: 's1', auth: { kind: 'ssh-password', username: 'u', passwordRef: '' } });
    expect(none.auth).toMatchObject({ passwordRef: '' });
    const key = canonicalServerRefs({ ...base, id: 's2', auth: { kind: 'ssh-key', username: 'u', keyPath: 'k', passphraseRef: 'another-secret' } });
    expect(key.auth).toMatchObject({ passphraseRef: 'server-s2-passphrase' });
    expect(canonicalServerRefs({ ...base, id: 's3', auth: { kind: 'ssh-key', username: 'u', keyPath: 'k' } }).auth).not.toHaveProperty('passphraseRef');
  });
});

describe('K4 the admin token never goes out in clear', { tags: ['critical'] }, () => {
  test('accepts ws only for this computer and wss for any host', () => {
    expect(parseServerUrl('ws://127.0.0.1:38290')).toMatchObject({ secure: false });
    expect(parseServerUrl('ws://localhost')).toMatchObject({ secure: false });
    expect(parseServerUrl('ws://[::1]:5000')).toMatchObject({ secure: false });
    expect(parseServerUrl('ws://192.168.1.5:38290')).toBeNull();
    expect(parseServerUrl('ws://play.example.net')).toBeNull();
    expect(parseServerUrl('wss://192.168.1.5:38290')).toMatchObject({ secure: true });
  });

  test('refuses to connect with a plain address of another computer before it opens a socket', async () => {
    await expect(openRemoteChannel({ url: 'ws://192.168.1.5:38290', token: 'secret' })).rejects.toThrow('wss://');
  });
});

describe('K1 the network options of the server', { tags: ['critical'] }, () => {
  test('accept a known mode and a flag, and nothing else', () => {
    expect(parseServerOptions({ mode: 'lan', publicLookup: false })).toEqual({ mode: 'lan', publicLookup: false });
    expect(parseServerOptions({ mode: 'everywhere', publicLookup: true })).toBeNull();
    expect(parseServerOptions({ mode: 'lan' })).toBeNull();
    expect(parseServerOptions({ mode: 'lan', publicLookup: 'yes' })).toBeNull();
    expect(parseServerOptions(null)).toBeNull();
    expect(parseServerOptions({ mode: 'lan', publicLookup: true, extra: 1 })).toEqual({ mode: 'lan', publicLookup: true });
  });
});
