/* @layer renderer-app @kind hook */
import { useEffect, useState } from 'react';
import { appApi } from '../ipc/app-api';
import { LAN_FAILED } from './lobby-hooks.constants';
import { logFailure } from './log-failure';
import type { LanEntry } from '../lobbies/lobbies.type';

const useLanServers = (enabled = true): LanEntry[] => {
  const [servers, setServers] = useState<LanEntry[]>([]);

  useEffect(() => {
    if (!enabled) {
      setServers([]);
      return undefined;
    }
    const api = appApi();
    const stop = api.onLanServers(setServers);
    api.lanBrowse(true).then(setServers, (error: unknown) => logFailure(LAN_FAILED, error));
    return () => {
      stop();
      void api.lanBrowse(false).catch(() => undefined);
    };
  }, [enabled]);

  return servers;
};

export { useLanServers };
