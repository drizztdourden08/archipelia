/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import { logFailure } from '../../../hooks/log-failure';
import { LOBBY_LOAD_FAILED } from '../../../hooks/lobby-hooks.constants';
import type { LiveTab } from '../../../live/live.type';
import { useLobbyStore } from '../../../stores/useLobbyStore';

const useTabLobbies = (tabs: readonly LiveTab[]): void => {
  const load = useLobbyStore((state) => state.load);
  const servers = [...new Set(tabs.map((tab) => tab.serverId))].sort().join('|');
  useEffect(() => {
    for (const serverId of servers.split('|').filter(Boolean)) load(serverId).catch((err: unknown) => logFailure(LOBBY_LOAD_FAILED, err));
  }, [load, servers]);
};

export { useTabLobbies };
