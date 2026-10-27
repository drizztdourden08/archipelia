/* @layer electron-main @kind logic */
import { runOverridesOf } from '@archipelia/model';
import type { SessionTemplate } from '@archipelia/model';
import type { SessionOverrides } from '../../src/live/live.type';
import type { SyncPlan } from '../sessions/sessions.type';
import { applyOverrides } from './overrides/apply-overrides';

const planOf = (saved: SessionTemplate, overrides: SessionOverrides) => {
  const template = applyOverrides(saved, overrides);
  const changes = runOverridesOf(saved, template);
  const plan: Omit<SyncPlan, 'lobbyId'> = {
    template,
    source: { sessionId: saved.id, sessionName: saved.name, overrides: changes },
    savedNames: new Set(saved.players.map((player) => player.name)),
  };
  return { plan, changes };
};

export { planOf };
