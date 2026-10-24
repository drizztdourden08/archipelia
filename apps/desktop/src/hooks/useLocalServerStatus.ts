/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useState } from 'react';
import { appApi } from '../ipc/app-api';
import type { LobbyServerStatus } from '../lobbies/lobbies.type';
import { STATUS_FAILED } from './lobby-hooks.constants';
import { logFailure } from './log-failure';

const useLocalServerStatus = () => {
  const [status, setStatus] = useState<LobbyServerStatus | null>(null);

  const reload = useCallback(async () => {
    try {
      setStatus(await appApi().lobbyServerStatus());
    } catch (error) {
      logFailure(STATUS_FAILED, error);
    }
  }, []);

  useEffect(() => { void reload(); }, [reload]);

  return { status, setStatus, reload };
};

export { useLocalServerStatus };
