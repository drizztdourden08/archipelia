/* @layer tests @kind test */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { createJoinService } from '../../electron/joins/create-join-service';
import { clientInfo } from '../../electron/joins/client-info';
import { createLobbyCloser } from '../../electron/sessions/create-lobby-closer';
import type { LobbyRequest } from '../../src/lobbies/lobbies.type';
import type { LiveTab } from '../../src/live/live.type';
import { lobby } from '../lobbies/lobby-fixtures';
import { tempFiles } from '../lobbies/temp-files';

const cleanups: (() => unknown)[] = [];

afterEach(async () => {
  for (const cleanup of cleanups.splice(0)) await cleanup();
});

const REF = { templateId: 't1', serverId: 'local', lobbyId: 'lb_1' };

const lanOf = (lobbyId: string): LiveTab => ({ tabId: `tab-${lobbyId}`, sessionId: lobbyId, serverId: 'local', lobbyId, overrides: {}, changes: [], lan: true, direct: true, openedAt: 1 });

const AT_ONCE = { retryMs: 10, retryMaxMs: 20 };

const NEVER = { retryMs: 3_600_000, retryMaxMs: 3_600_000 };

const UNTIL_DONE = { timeout: 5000 };

const setUp = async (failures: number, tabs: LiveTab[] = [], retry = AT_ONCE) => {
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
    files: store.files, opsFor: () => Promise.resolve({ act, list: () => Promise.resolve([lobby()]) }), live: () => Promise.resolve(tabs),
    quiet, emit: () => undefined, ...retry,
  });
  cleanups.push(closer.stop);
  return { closer, closed, quiet };
};

describe('closing the lobby of a session', () => {
  test('keeps a pending close while the server does not answer, until a retry reaches it, then goes private when no other session runs on your network', async () => {
    const { closer, closed, quiet } = await setUp(2, [], NEVER);
    expect(await closer.close(REF)).toEqual({ closed: false });
    expect(await closer.list()).toEqual([REF]);
    await closer.retryAll();
    expect(await closer.list()).toEqual([REF]);
    expect(closed).toEqual([]);
    expect(quiet).not.toHaveBeenCalled();
    await closer.retryAll();
    expect(closed).toEqual(['lb_1']);
    expect(await closer.list()).toEqual([]);
    expect(quiet).toHaveBeenCalledTimes(1);
  });

  test('retries a pending close on its own timer until the server answers', async () => {
    const { closer, closed, quiet } = await setUp(2);
    expect(await closer.close(REF)).toEqual({ closed: false });
    await vi.waitFor(() => expect(quiet).toHaveBeenCalledTimes(1), UNTIL_DONE);
    expect(closed).toEqual(['lb_1']);
    expect(await closer.list()).toEqual([]);
  });

  test('stays on the network while another open tab is a LAN session with direct connections on its lobby here', async () => {
    const { closer, quiet } = await setUp(0, [lanOf('lb_1'), lanOf('lb_2')]);
    expect(await closer.close(REF)).toEqual({ closed: true });
    expect(quiet).not.toHaveBeenCalled();
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
    const offline = new Set<string>();
    let bothOffline: () => void = () => undefined;
    const reached = new Promise<void>((resolve) => { bothOffline = resolve; });
    const service = createJoinService({
      files: store.files, readWorld: () => Promise.resolve(new Uint8Array()), client: clientInfo('Archipelia', '0.1.0'), engineAp: () => Promise.resolve('0.6.8'),
      emit: (view) => {
        if (view.state === 'offline') offline.add(view.id);
        if (offline.size === 2) bothOffline();
      },
      connect: (address) => {
        tried.push(address);
        return Promise.reject(new Error('down'));
      },
    });
    cleanups.push(service.closeAll);
    await service.resumeAll();
    await reached;
    expect(tried).toHaveLength(2);
    const views = await service.list();
    expect(views.filter((view) => view.state === 'offline').map((view) => view.id).sort()).toEqual(['a', 'b']);
    expect(views.find((view) => view.id === 'a')?.message).toContain('tries again');
  });
});
