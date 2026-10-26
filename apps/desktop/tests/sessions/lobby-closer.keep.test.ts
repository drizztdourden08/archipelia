/* @layer tests @kind test */
import { afterEach, describe, expect, test, vi } from 'vitest';
import type { SessionTemplate } from '@archipelia/model';
import { createJoinService } from '../../electron/joins/create-join-service';
import { clientInfo } from '../../electron/joins/client-info';
import { createLobbyCloser } from '../../electron/sessions/create-lobby-closer';
import { removeTemplate } from '../../electron/sessions/remove-template';
import type { LobbyRequest } from '../../src/lobbies/lobbies.type';
import { newTemplate } from '../../src/views/SessionBuilder/behavior/new-template';
import { lobby } from '../lobbies/lobby-fixtures';
import { tempFiles } from '../lobbies/temp-files';

const cleanups: (() => unknown)[] = [];

afterEach(async () => {
  for (const cleanup of cleanups.splice(0)) await cleanup();
});

const REF = { templateId: 't1', serverId: 'local', lobbyId: 'lb_1' };

const lanOf = (lobbyId: string): SessionTemplate => ({ ...newTemplate(lobbyId), lan: true, lobby: { serverId: 'local', lobbyId } });

const setUp = async (failures: number, templates: SessionTemplate[] = []) => {
  const store = await tempFiles('server');
  cleanups.push(store.remove);
  const closed: string[] = [];
  let left = failures;
  const quiet = vi.fn(() => Promise.resolve());
  const act = (request: LobbyRequest) => {
    if (left > 0) {
      left -= 1;
      return Promise.reject(new Error('the server did not answer'));
    }
    closed.push(String(request.params.lobbyId));
    return Promise.resolve(lobby({ phase: 'closed' }));
  };
  const closer = createLobbyCloser({
    files: store.files, opsFor: () => Promise.resolve({ act, list: () => Promise.resolve([lobby()]) }), templates: () => Promise.resolve(templates),
    quiet, emit: () => undefined, retryMs: 10, retryMaxMs: 20,
  });
  cleanups.push(closer.stop);
  return { closer, closed, quiet };
};

describe('closing the lobby of a session', () => {
  test('keeps a pending close while the server does not answer, retries, then goes private when no other session runs on your network', async () => {
    const { closer, closed, quiet } = await setUp(2);
    expect(await closer.close(REF)).toEqual({ closed: false });
    expect(await closer.list()).toEqual([REF]);
    await vi.waitFor(() => expect(closed).toEqual(['lb_1']));
    await vi.waitFor(async () => expect(await closer.list()).toEqual([]));
    expect(quiet).toHaveBeenCalledTimes(1);
  });

  test('stays on the network while another LAN session still has its lobby open here', async () => {
    const { closer, quiet } = await setUp(0, [lanOf('lb_1'), lanOf('lb_2')]);
    expect(await closer.close(REF)).toEqual({ closed: true });
    expect(quiet).not.toHaveBeenCalled();
  });

  test('closes the lobby of a session that is deleted', async () => {
    const { closer, closed } = await setUp(0);
    const remove = vi.fn(() => Promise.resolve());
    await removeTemplate('t1', { get: () => Promise.resolve(lanOf('lb_1')), remove }, closer.close);
    expect(closed).toEqual(['lb_1']);
    expect(remove).toHaveBeenCalledWith('t1');
  });
});

describe('the joins resumed at start', () => {
  test('are only the ones waiting or approved, never failed, refused or finished ones', async () => {
    const store = await tempFiles('joins');
    cleanups.push(store.remove);
    const base = { address: '127.0.0.1:9', code: 'K7QM4XT2', displayName: 'Cy', slotName: 'Cy', game: 'Quest', token: 't', createdAt: 1, updatedAt: 1, yaml: { text: '', sha256: '', size: 0 } };
    const states = { a: 'pending', b: 'approved', c: 'failed', d: 'refused', e: 'started' } as const;
    await store.files.writeJson('joins.json', Object.entries(states).map(([id, state]) => ({ ...base, id, state, admission: state === 'pending' ? 'pending' : 'approved' })));
    const tried: string[] = [];
    const service = createJoinService({
      files: store.files, readWorld: () => Promise.resolve(new Uint8Array()), client: clientInfo('Archipelia', '0.1.0'), engineAp: () => Promise.resolve('0.6.8'), emit: () => undefined,
      connect: (address) => {
        tried.push(address);
        return Promise.reject(new Error('down'));
      },
    });
    cleanups.push(service.closeAll);
    await service.resumeAll();
    await vi.waitFor(() => expect(tried).toHaveLength(2));
    const views = await service.list();
    expect(views.filter((view) => view.state === 'offline').map((view) => view.id).sort()).toEqual(['a', 'b']);
    expect(views.find((view) => view.id === 'a')?.message).toContain('tries again');
  });
});
