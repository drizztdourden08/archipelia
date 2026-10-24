/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useState } from 'react';
import type { LobbyServerEntry } from '@archipelia/model';
import { appApi } from '../ipc/app-api';
import { LOAD_FAILED } from './lobby-hooks.constants';
import { logFailure } from './log-failure';

const useLobbyServerEntries = () => {
  const [entries, setEntries] = useState<LobbyServerEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  const reload = useCallback(async () => {
    try {
      setEntries(await appApi().lobbyServersList());
    } catch (error) {
      logFailure(LOAD_FAILED, error);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => { void reload(); }, [reload]);

  return { entries, loaded, reload };
};

export { useLobbyServerEntries };
