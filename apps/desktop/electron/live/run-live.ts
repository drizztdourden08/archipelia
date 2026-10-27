/* @layer electron-main @kind logic */
import { lobbyServerOf } from '../../src/lobbies/lobby-server-of';
import { onLan } from '../sessions/on-lan';
import { runSession } from '../sessions/run-session';
import { LIVE_TEXT } from './live.constants';
import { assertRunnable } from './assert-runnable';
import type { LiveServiceDeps } from './live.type';
import { lobbyDepsOf } from './lobby-deps-of';
import { planOf } from './plan-of';

const runLive = async (deps: LiveServiceDeps, tabId: string) => {
  const tab = await deps.store.get(tabId);
  if (!tab) throw new Error(LIVE_TEXT.noTab);
  const saved = await deps.templates.get(tab.sessionId);
  if (!saved) throw new Error(LIVE_TEXT.deleted);
  const { plan, changes } = planOf(saved, tab.overrides);
  if (lobbyServerOf(plan.template) !== tab.serverId) throw new Error(LIVE_TEXT.moved);
  assertRunnable(plan.template, await deps.library());
  await deps.store.patch(tabId, { changes, lan: onLan(plan.template), direct: plan.template.direct !== undefined });
  return runSession({ ...plan, lobbyId: tab.lobbyId }, await lobbyDepsOf(deps, tab.serverId));
};

export { runLive };
