/* @layer renderer-app @kind hook */
import { useCallback } from 'react';
import { confirmAction } from '@drizztdourden08/brock-react';
import { closeTab } from '../../../live/close-tab';
import { overridesOfDraft } from '../../../live/overrides-of-draft';
import { useRunLauncher } from '../../../hooks/useRunLauncher';
import { useSessionStart } from '../../../hooks/useSessionStart';
import { seatsLeftOut } from '../../../lobbies/seats-left-out';
import { useTabDraftStore } from '../../../stores/useTabDraftStore';
import type { LobbyActionDeps } from '../SessionLobby.type';
import { leftOutOptions } from './left-out-options';
import { nextSlot } from './next-slot';

const useLobbyActions = ({ tab, saved, draft, saveTemplate, guard, attemptRun, lobby }: LobbyActionDeps) => {
  const startSession = useSessionStart();
  const launcher = useRunLauncher();
  const { tabId } = tab;

  const run = useCallback(() => (attemptRun() ? guard('run', async () => {
    const left = seatsLeftOut(lobby);
    if (left.length > 0 && !(await confirmAction(leftOutOptions(left)))) return;
    const synced = await startSession({ template: draft, overrides: overridesOfDraft(tab, saved, draft) });
    if (!synced) return;
    useTabDraftStore.getState().clear(tabId);
    await launcher.start(synced, draft.name);
  }) : undefined), [attemptRun, draft, guard, launcher, lobby, saved, startSession, tab, tabId]);

  const close = useCallback(() => guard('close', () => closeTab(tabId)), [guard, tabId]);

  const keep = useCallback((slot: number) => guard('keep', async () => {
    const player = draft.players.find((entry) => entry.slot === slot);
    if (player) await saveTemplate({ ...saved, players: [...saved.players, { ...structuredClone(player), slot: nextSlot(saved.players) }] });
  }), [draft.players, guard, saveTemplate, saved]);

  return { close, keep, run };
};

export { useLobbyActions };
