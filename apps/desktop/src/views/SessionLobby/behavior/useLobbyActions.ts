/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useState } from 'react';
import { confirmAction } from '@drizztdourden08/brock-react';
import type { SessionTemplate } from '@archipelia/model';
import { appApi } from '../../../ipc/app-api';
import { openSessionEditor } from '../../../hooks/open-session-editor';
import { useRunLauncher } from '../../../hooks/useRunLauncher';
import { useSessionStart } from '../../../hooks/useSessionStart';
import { CLOSE_LOBBY } from '../SessionLobby.constants';
import type { LobbyActionDeps } from '../SessionLobby.type';

const withoutLobbyId = (template: SessionTemplate): SessionTemplate => {
  const { lobby, ...rest } = template;
  return lobby ? { ...rest, lobby: { serverId: lobby.serverId } } : rest;
};

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
    const { lobby } = draft;
    if (lobby?.lobbyId) await appApi().lobbyClose({ templateId: draft.id, serverId: lobby.serverId, lobbyId: lobby.lobbyId });
    await keep(withoutLobbyId(draft));
    setClosed(true);
  }), [draft, guard, keep]);

  useEffect(() => { if (closed && !dirty) openSessionEditor(draft.id); }, [closed, dirty, draft.id]);

  return { close, run, save, start };
};

export { useLobbyActions };
