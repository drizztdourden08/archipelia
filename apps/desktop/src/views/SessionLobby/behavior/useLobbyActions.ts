/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useState } from 'react';
import { confirmAction } from '@drizztdourden08/brock-react';
import type { SessionTemplate } from '@archipelia/model';
import { appApi } from '../../../ipc/app-api';
import { openSessionEditor } from '../../../hooks/open-session-editor';
import { useRunLauncher } from '../../../hooks/useRunLauncher';
import { useSessionStart } from '../../../hooks/useSessionStart';
import { closeModeOf } from '../../../live/close-mode-of';
import { useLiveStore } from '../../../stores/useLiveStore';
import { useLobbyStore } from '../../../stores/useLobbyStore';
import { CLOSE_LOBBY } from '../SessionLobby.constants';
import type { LobbyActionDeps } from '../SessionLobby.type';

const openLobbyOf = (serverId: string, lobbyId: string) => useLobbyStore.getState().lobbies[serverId]?.find((entry) => entry.id === lobbyId);

const useLobbyActions = ({ draft, keep, dirty, guard, attemptRun }: LobbyActionDeps) => {
  const startSession = useSessionStart();
  const launcher = useRunLauncher();
  const [closed, setClosed] = useState(false);

  const sync = useCallback((template: SessionTemplate) => startSession(template, keep), [keep, startSession]);
  const save = useCallback(() => guard('save', () => sync(draft)), [draft, guard, sync]);
  const start = useCallback(() => guard('start', () => sync(draft)), [draft, guard, sync]);

  const run = useCallback(() => (attemptRun() ? guard('run', async () => {
    const saved = await sync(draft);
    if (saved) await launcher.start(saved);
  }) : undefined), [attemptRun, draft, guard, launcher, sync]);

  const close = useCallback(() => guard('close', async () => {
    if (!(await confirmAction(CLOSE_LOBBY))) return;
    const tab = useLiveStore.getState().tabs.find((entry) => entry.sessionId === draft.id);
    if (tab) await appApi().liveClose(tab.tabId, closeModeOf(openLobbyOf(tab.serverId, tab.lobbyId)));
    await keep(draft);
    setClosed(true);
  }), [draft, guard, keep]);

  useEffect(() => { if (closed && !dirty) openSessionEditor(draft.id); }, [closed, dirty, draft.id]);

  return { close, run, save, start };
};

export { useLobbyActions };
