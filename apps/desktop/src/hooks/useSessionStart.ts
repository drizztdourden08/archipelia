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
  const { status, setStatus, reload } = useLocalServerStatus();
  const apply = useLobbyStore((state) => state.apply);

  const consent = useCallback(async (template: SessionTemplate): Promise<boolean> => {
    if (template.lan !== true || lobbyServerOf(template) !== LOCAL_SERVER || status?.options.lanConsent === true) return true;
    if (!status || !(await confirmAction(OPEN_LAN))) return false;
    setStatus(await appApi().lobbyServerApply({ ...status.options, lanConsent: true }));
    return true;
  }, [setStatus, status]);

  return useCallback(async (template: SessionTemplate, keep: (saved: SessionTemplate) => Promise<SessionTemplate>): Promise<SessionTemplate | null> => {
    if (!(await consent(template))) return null;
    const serverId = lobbyServerOf(template);
    const lobby = await appApi().sessionsStart(template);
    apply({ serverId, lobby });
    await reload();
    return keep({ ...template, lobby: { serverId, lobbyId: lobby.id } });
  }, [apply, consent, reload]);
};

export { useSessionStart };
