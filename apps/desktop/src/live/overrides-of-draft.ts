/* @layer renderer-app @kind logic */
import type { SessionTemplate } from '@archipelia/model';
import type { LiveTab, SessionOverrides } from './live.type';

const overridesOfDraft = (tab: LiveTab, saved: SessionTemplate, draft: SessionTemplate): SessionOverrides => {
  const { players: _replaced, ...rest } = tab.overrides;
  return JSON.stringify(draft.players) === JSON.stringify(saved.players) ? rest : { ...rest, players: draft.players };
};

export { overridesOfDraft };
