/* @layer renderer-app @kind hook */
import { useCallback } from 'react';
import { confirmAction } from '@drizztdourden08/brock-react';
import type { SessionTemplate } from '@archipelia/model';
import { appApi } from '../ipc/app-api';
import { LOCAL_SERVER } from '../lobbies/lobbies.constants';
import { lobbyServerOf } from '../lobbies/lobby-server-of';
import { useLobbyStore } from '../stores/useLobbyStore';
import { OPEN_LAN } from './lobby-hooks.constants';
import { useLocalServerStatus } from './useLocalServerStatus';

const useSessionStart = () => {
  const { status, reload } = useLocalServerStatus();
  const apply = useLobbyStore((state) => state.apply);
  const mode = status?.options.mode;

  return useCallback(async (template: SessionTemplate, keep: (saved: SessionTemplate) => Promise<SessionTemplate>): Promise<SessionTemplate | null> => {
    const serverId = lobbyServerOf(template);
    const opens = template.lan === true && serverId === LOCAL_SERVER && (mode === undefined || mode === 'off');
    if (opens && !(await confirmAction(OPEN_LAN))) return null;
    const lobby = await appApi().sessionsStart(template);
    apply({ serverId, lobby });
    if (opens) await reload();
    return keep({ ...template, lobby: { serverId, lobbyId: lobby.id } });
  }, [apply, mode, reload]);
};

export { useSessionStart };
