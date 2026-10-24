/* @layer tests @kind test */
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import type { SecretStore } from '@archipelia/hosts';
import type { Session, SessionTemplate } from '@archipelia/model';
import type { LobbyRun } from '@archipelia/sessions';
import { createRoomSecrets } from '../../src/core/room-secrets/create-room-secrets';
import { IN_MEMORY_NOTICE } from '../../src/core/room-secrets/room-secrets.constants';
import { createLobbyService } from '../../src/lobby/create-lobby-service';
import { createLobbyStore } from '../../src/lobby/store/create-lobby-store';
import { createNodeDomains } from '../../src/node';
import { engine, helloOf, holdFiles, linkOf } from './security-kit';
import { fakeTrust, testDeps } from './test-deps';

const NO_KEYRING = 'This system cannot keep a secret encrypted, so it was not stored.';

const vaultOf = (keyring: boolean) => {
  const kept = new Map<string, string>();
  const calls: string[] = [];
  const vault: SecretStore = {
    get: (name) => {
      calls.push(`get ${name}`);
      return Promise.resolve(keyring ? (kept.get(name) ?? null) : null);
    },
    set: (name, value) => {
      calls.push(`set ${name}`);
      if (!keyring) return Promise.reject(new Error(NO_KEYRING));
      kept.set(name, value);
      return Promise.resolve();
    },
  };
  return { vault, calls };
};

const secretsOf = (keyring: boolean) => {
  const { vault, calls } = vaultOf(keyring);
  const logs: string[] = [];
  const secrets = createRoomSecrets({ vault, canStore: () => keyring, log: (message) => logs.push(message) });
  return { secrets, calls, logs };
};

describe('room secrets without a keyring', () => {
  test('a room password is kept in memory, and the vault is never asked', async () => {
    const { secrets, calls } = secretsOf(false);
    await secrets.set('lobby-room-lb_1', 'pw-1', 'Room password');
    expect(await secrets.get('lobby-room-lb_1')).toBe('pw-1');
    expect(await secrets.get('lobby-room-lb_2')).toBeNull();
    expect(calls).toEqual([]);
  });

  test('the host is told once, in plain words, that the passwords live in memory', async () => {
    const { secrets, logs } = secretsOf(false);
    await secrets.set('lobby-room-lb_1', 'a');
    await secrets.set('lobby-room-lb_2', 'b');
    expect(logs).toEqual([IN_MEMORY_NOTICE]);
    expect(IN_MEMORY_NOTICE).toContain('memory only');
  });

  test('a long-lived secret still needs the vault and is refused', async () => {
    const { secrets, calls } = secretsOf(false);
    for (const name of ['lobby-admin-token', 'ssh-password-s1', 'gg-owner']) await expect(secrets.set(name, 'x')).rejects.toThrow(NO_KEYRING);
    expect(calls).toEqual(['set lobby-admin-token', 'set ssh-password-s1', 'set gg-owner']);
    expect(await secrets.get('gg-owner')).toBeNull();
  });
});

describe('room secrets with a keyring', () => {
  test('a room password goes to the vault and every other secret too', async () => {
    const { secrets, calls, logs } = secretsOf(true);
    await secrets.set('lobby-room-lb_1', 'pw-1');
    await secrets.set('gg-owner', 'owner');
    expect(await secrets.get('lobby-room-lb_1')).toBe('pw-1');
    expect(await secrets.get('gg-owner')).toBe('owner');
    expect(calls).toEqual(['set lobby-room-lb_1', 'set gg-owner', 'get lobby-room-lb_1', 'get gg-owner']);
    expect(logs).toEqual([]);
  });
});

describe('starting a lobby on a system with no keyring', () => {
  const failedRun = (template: SessionTemplate, lobby: LobbyRun): Session =>
    ({ id: `s_${lobby.lobbyId}`, snapshot: template, status: 'failed', createdAt: 0, lobbyId: lobby.lobbyId, error: 'stopped by the test' });

  test('the start succeeds, and the room password the run is given can be read back', async () => {
    const dataDir = await mkdtemp(join(tmpdir(), 'archipelia-room-secrets-'));
    const domains = createNodeDomains(dataDir);
    const store = createLobbyStore(domains.domain('lobbies'));
    const { secrets, calls, logs } = secretsOf(false);
    const templates: SessionTemplate[] = [];
    const run = (template: SessionTemplate, lobby: LobbyRun) => {
      templates.push(template);
      return Promise.resolve(failedRun(template, lobby));
    };
    const service = createLobbyService({ ...testDeps({ store, output: domains.domain('sessions'), root: dataDir, trust: fakeTrust('active'), run }), secrets });
    const lobby = await service.create({ name: 'Keyless', engine, options: { admission: 'open' } });
    await service.protocol.join(helloOf(), linkOf().link);
    await holdFiles(store, lobby.id, ['W', 'Y']);
    await service.protocol.settle(lobby.id);
    const finished = await (await service.start(lobby.id)).finished;
    expect(finished.failure?.message).not.toContain('cannot keep a secret');
    const ref = templates[0]?.server.passwordRef ?? '';
    expect(ref).toMatch(/^lobby-room-/);
    expect(await secrets.get(ref)).toBeTruthy();
    expect(calls).toEqual([]);
    expect(logs).toEqual([IN_MEMORY_NOTICE]);
    await rm(dataDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  });
});
