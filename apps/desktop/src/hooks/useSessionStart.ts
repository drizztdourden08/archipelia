/* @layer renderer-app @kind hook */
import { useCallback } from 'react';
import { confirmAction } from '@drizztdourden08/brock-react';
import { appApi } from '../ipc/app-api';
import type { LiveTab } from '../live/live.type';
import { LOCAL_SERVER } from '../lobbies/lobbies.constants';
import { lobbyServerOf } from '../lobbies/lobby-server-of';
import { useLiveStore } from '../stores/useLiveStore';
import { useLobbyStore } from '../stores/useLobbyStore';
import { OPEN_LAN } from './lobby-hooks.constants';
import type { SessionStartInput } from './session-start.type';
import { useLocalServerStatus } from './useLocalServerStatus';

const useSessionStart = () => {
  const { status, setStatus, reload } = useLocalServerStatus();
  const apply = useLobbyStore((state) => state.apply);

  const consent = useCallback(async ({ template }: SessionStartInput): Promise<boolean> => {
    if (template.lan !== true || lobbyServerOf(template) !== LOCAL_SERVER || status?.options.lanConsent === true) return true;
    if (!status || !(await confirmAction(OPEN_LAN))) return false;
    setStatus(await appApi().lobbyServerApply({ ...status.options, lanConsent: true }));
    return true;
  }, [setStatus, status]);

  return useCallback(async (input: SessionStartInput): Promise<LiveTab | null> => {
    if (!(await consent(input))) return null;
    const { template, keep, overrides } = input;
    const saved = keep ? await keep(template) : template;
    const { tab, lobby } = await appApi().sessionsStart(saved.id, overrides);
    apply({ serverId: tab.serverId, lobby });
    useLiveStore.getState().include(tab);
    await reload();
    return tab;
  }, [apply, consent, reload]);
};

export { useSessionStart };
