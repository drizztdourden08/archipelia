/* @layer tests @kind test */
import { afterEach, describe, expect, test, vi } from 'vitest';
import type { AdminLobby, SessionTemplate } from '@archipelia/model';
import { createLiveSessions } from '../../electron/live/create-live-sessions';
import type { LiveServiceDeps } from '../../electron/live/live.type';
import { settleLiveTabs } from '../../electron/live/settle-live-tabs';
import type { LiveTab } from '../../src/live/live.type';
import { lobby } from '../lobbies/lobby-fixtures';
import { tempFiles } from '../lobbies/temp-files';
import { sessionOf } from './live-kit';

const cleanups: (() => unknown)[] = [];

afterEach(async () => {
  for (const cleanup of cleanups.splice(0)) await cleanup();
});

const legacy = (id: string, lobbyId: string, patch: Partial<SessionTemplate> = {}): SessionTemplate =>
  sessionOf({ id, lobby: { serverId: 'local', lobbyId }, lan: true, direct: { admission: 'host-approval', allowUnlisted: false }, ...patch });

const settleWith = async (templates: SessionTemplate[], lobbies: () => Promise<AdminLobby[]>, tabs: LiveTab[] = []) => {
  const files = await tempFiles('server');
  cleanups.push(files.remove);
  const store = createLiveSessions({ files: files.files, emit: () => undefined });
  await files.files.writeJson('live-sessions.json', tabs);
  const kept = new Map(templates.map((template) => [template.id, template]));
  const save = vi.fn((template: SessionTemplate) => {
    kept.set(template.id, template);
    return Promise.resolve(template);
  });
  const deps: LiveServiceDeps = {
    store, templates: { get: (id) => Promise.resolve(kept.get(id) ?? null), list: () => Promise.resolve([...kept.values()]), save },
    library: () => Promise.resolve({ installed: [], presets: [] }), lobbies: () => Promise.resolve({ act: () => Promise.reject(new Error('unused')), list: lobbies }),
    slotOf: () => Promise.reject(new Error('unused')), beforeOpen: () => Promise.resolve(), beforeRun: () => Promise.resolve(),
    closer: { close: () => Promise.resolve({ closed: true }) }, cancelRun: () => Promise.resolve(),
  };
  await settleLiveTabs(deps);
  return { store, kept, save };
};

const tabOf = (sessionId: string, lobbyId: string): LiveTab =>
  ({ tabId: `tab-${lobbyId}`, sessionId, serverId: 'local', lobbyId, overrides: {}, changes: [], lan: false, direct: false, openedAt: 1 });

describe('the lobby a saved session used to hold', () => {
  test('moves to a live tab when the lobby is still open, and the saved session loses it', async () => {
    const { store, kept } = await settleWith([legacy('t1', 'lb_1')], () => Promise.resolve([lobby({ id: 'lb_1', phase: 'hosting', sessionId: 'run-9' })]));
    expect(await store.list()).toMatchObject([{ sessionId: 't1', serverId: 'local', lobbyId: 'lb_1', runId: 'run-9', lan: true, direct: true, overrides: {}, changes: [] }]);
    expect(kept.get('t1')?.lobby).toEqual({ serverId: 'local' });
  });

  test('is dropped when the lobby is closed or gone, with no tab written', async () => {
    const { store, kept } = await settleWith([legacy('t1', 'lb_1'), legacy('t2', 'lb_2')], () => Promise.resolve([lobby({ id: 'lb_1', phase: 'closed' })]));
    expect(await store.list()).toEqual([]);
    expect(kept.get('t1')?.lobby).toEqual({ serverId: 'local' });
    expect(kept.get('t2')?.lobby).toEqual({ serverId: 'local' });
  });

  test('stays on the saved session for the next start when its server does not answer', async () => {
    const { store, save } = await settleWith([legacy('t1', 'lb_1')], () => Promise.reject(new Error('down')));
    expect(await store.list()).toEqual([]);
    expect(save).not.toHaveBeenCalled();
  });

  test('does not write a second tab for a session that has one', async () => {
    const { store } = await settleWith([legacy('t1', 'lb_1')], () => Promise.resolve([lobby({ id: 'lb_1' })]), [tabOf('t1', 'lb_1')]);
    expect(await store.list()).toHaveLength(1);
  });
});

describe('the live tabs at the next launch', () => {
  test('keeps the tabs whose lobby is alive and drops the others', async () => {
    const { store } = await settleWith([sessionOf()], () => Promise.resolve([lobby({ id: 'lb_1' }), lobby({ id: 'lb_2', phase: 'closed' })]), [tabOf('a', 'lb_1'), tabOf('b', 'lb_2'), tabOf('c', 'lb_3')]);
    expect((await store.list()).map((tab) => tab.lobbyId)).toEqual(['lb_1']);
  });

  test('keeps every tab when the server cannot be asked', async () => {
    const { store } = await settleWith([sessionOf()], () => Promise.reject(new Error('down')), [tabOf('a', 'lb_1')]);
    expect(await store.list()).toHaveLength(1);
  });
});
