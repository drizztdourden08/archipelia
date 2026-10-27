/* @layer tests @kind test */
import type { SessionTemplate } from '@archipelia/model';
import type { StartPlan, SyncPlan } from '../../electron/sessions/sessions.type';

const startPlan = (template: SessionTemplate, lobbyId?: string): StartPlan => ({
  template,
  ...(lobbyId ? { lobbyId } : {}),
  source: { sessionId: template.id, sessionName: template.name, overrides: [] },
  savedNames: new Set(template.players.map((player) => player.name)),
});

const syncPlan = (template: SessionTemplate, lobbyId: string): SyncPlan => ({ ...startPlan(template), lobbyId });

export { startPlan, syncPlan };
