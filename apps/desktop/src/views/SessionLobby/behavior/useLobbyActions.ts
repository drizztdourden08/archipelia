/* @layer renderer-app @kind hook */
import { useCallback } from 'react';
import { closeTab } from '../../../live/close-tab';
import { overridesOfDraft } from '../../../live/overrides-of-draft';
import { useRunLauncher } from '../../../hooks/useRunLauncher';
import { useSessionStart } from '../../../hooks/useSessionStart';
import { useTabDraftStore } from '../../../stores/useTabDraftStore';
import type { LobbyActionDeps } from '../SessionLobby.type';

const useLobbyActions = ({ tab, saved, draft, guard, attemptRun }: LobbyActionDeps) => {
  const startSession = useSessionStart();
  const launcher = useRunLauncher();
  const { tabId } = tab;

  const run = useCallback(() => (attemptRun() ? guard('run', async () => {
    const synced = await startSession({ template: draft, overrides: overridesOfDraft(tab, saved, draft) });
    if (!synced) return;
    useTabDraftStore.getState().clear(tabId);
    await launcher.start(synced, draft.name);
  }) : undefined), [attemptRun, draft, guard, launcher, saved, startSession, tab, tabId]);

  const close = useCallback(() => guard('close', () => closeTab(tabId)), [guard, tabId]);

  return { close, run };
};

export { useLobbyActions };
