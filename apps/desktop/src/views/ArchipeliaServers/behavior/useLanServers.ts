/* @layer renderer-app @kind hook */
import { useEffect, useState } from 'react';
import { appApi } from '../../../ipc/app-api';
import { LAN_FAILED } from '../../../hooks/lobby-hooks.constants';
import { logFailure } from '../../../hooks/log-failure';
import type { LanEntry } from '../../../lobbies/lobbies.type';

const useLanServers = (): LanEntry[] => {
  const [servers, setServers] = useState<LanEntry[]>([]);

  useEffect(() => {
    const api = appApi();
    const stop = api.onLanServers(setServers);
    api.lanBrowse(true).then(setServers, (error: unknown) => logFailure(LAN_FAILED, error));
    return () => {
      stop();
      void api.lanBrowse(false).catch(() => undefined);
    };
  }, []);

  return servers;
};

export { useLanServers };
