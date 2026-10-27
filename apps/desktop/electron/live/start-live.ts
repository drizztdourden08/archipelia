/* @layer electron-main @kind logic */
import type { AdminLobby } from '@archipelia/model';
import type { LiveStart, LiveTab, SessionOverrides } from '../../src/live/live.type';
import { lobbyServerOf } from '../../src/lobbies/lobby-server-of';
import { onLan } from '../sessions/on-lan';
import { RUNNABLE_PHASES } from '../sessions/sessions.constants';
import { startSession } from '../sessions/start-session';
import { assertStartable } from './assert-startable';
import { LIVE_TEXT } from './live.constants';
import type { LiveServiceDeps } from './live.type';
import { lobbyDepsOf } from './lobby-deps-of';
import { parseOverrides } from './overrides/parse-overrides';
import { planOf } from './plan-of';

const tabFacts = (where: { sessionId: string; serverId: string; lobbyId: string }, overrides: SessionOverrides, plan: ReturnType<typeof planOf>) => ({
  ...where, overrides, changes: plan.changes, lan: onLan(plan.plan.template), direct: plan.plan.template.direct !== undefined,
});

const keepTab = async (deps: LiveServiceDeps, existing: LiveTab | undefined, lobby: AdminLobby, facts: ReturnType<typeof tabFacts>): Promise<LiveTab> => {
  if (!existing) return deps.store.open(facts);
  if (!RUNNABLE_PHASES.includes(lobby.phase)) return existing;
  const sameLobby = existing.lobbyId === facts.lobbyId;
  return (await deps.store.patch(existing.tabId, { ...facts, ...(sameLobby ? {} : { runId: undefined }) })) ?? existing;
};

const startLive = async (deps: LiveServiceDeps, sessionId: string, raw?: unknown): Promise<LiveStart> => {
  const saved = await deps.templates.get(sessionId);
  if (!saved) throw new Error(LIVE_TEXT.notSaved);
  const existing = await deps.store.forSession(sessionId);
  const overrides = raw === undefined ? (existing?.overrides ?? {}) : parseOverrides(raw);
  const planned = planOf(saved, overrides);
  assertStartable(planned.plan.template);
  const serverId = existing?.serverId ?? lobbyServerOf(planned.plan.template);
  if (lobbyServerOf(planned.plan.template) !== serverId) throw new Error(LIVE_TEXT.moved);
  const started = await startSession({ ...planned.plan, lobbyId: existing?.lobbyId }, await lobbyDepsOf(deps, serverId));
  const tab = await keepTab(deps, existing, started.lobby, tabFacts({ sessionId, serverId, lobbyId: started.lobbyId }, overrides, planned));
  return { tab, lobby: started.lobby };
};

export { startLive };
