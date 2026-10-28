/* @layer renderer-app @kind hook */
import { useCallback } from 'react';
import { closeTab } from '../../../live/close-tab';
import { overridesOfDraft } from '../../../live/overrides-of-draft';
import { useRunLauncher } from '../../../hooks/useRunLauncher';
import { useSessionStart } from '../../../hooks/useSessionStart';
import { useTabDraftStore } from '../../../stores/useTabDraftStore';
import type { LobbyActionDeps } from '../SessionLobby.type';
import { nextSlot } from './next-slot';

const useLobbyActions = ({ tab, saved, draft, saveTemplate, guard, attemptRun }: LobbyActionDeps) => {
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

  const keep = useCallback((slot: number) => guard('keep', async () => {
    const player = draft.players.find((entry) => entry.slot === slot);
    if (player) await saveTemplate({ ...saved, players: [...saved.players, { ...structuredClone(player), slot: nextSlot(saved.players) }] });
  }), [draft.players, guard, saveTemplate, saved]);

  return { close, keep, run };
};

export { useLobbyActions };
