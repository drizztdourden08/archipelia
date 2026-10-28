/* @layer renderer-app @kind hook */
import { useCallback, useEffect } from 'react';
import { useKeyedGuard } from '@drizztdourden08/brock-react';
import { failWith } from '../../../hooks/fail-with';
import { useLocalServerStatus } from '../../../hooks/useLocalServerStatus';
import { appApi } from '../../../ipc/app-api';
import { LOCAL_SERVER } from '../../../lobbies/lobbies.constants';
import type { LobbyServerOptions } from '../../../lobbies/lobbies.type';
import { useEngineStore } from '../../../stores/useEngineStore';
import { useLobbyStore } from '../../../stores/useLobbyStore';
import { FAILURE } from '../ArchipeliaServers.constants';
import { useLanServers } from '../../../hooks/useLanServers';
import { useRemoteServers } from './useRemoteServers';

const useArchipeliaServers = () => {
  const remote = useRemoteServers();
  const { status, setStatus, reload } = useLocalServerStatus();
  const lan = useLanServers();
  const ap = useEngineStore((state) => state.overview?.active?.ap);
  const loadEngine = useEngineStore((state) => state.load);
  const local = useLobbyStore((state) => state.lobbies[LOCAL_SERVER]);
  const { guard, isBusy, errorOf } = useKeyedGuard();

  useEffect(() => { void loadEngine().catch(() => undefined); }, [loadEngine]);
  useEffect(() => { void reload(); }, [local, reload]);

  const apply = useCallback((patch: Partial<LobbyServerOptions>) => {
    if (!status) return;
    void guard('apply', failWith(FAILURE.apply, async () => { setStatus(await appApi().lobbyServerApply({ ...status.options, ...patch })); }));
  }, [guard, setStatus, status]);

  return { remote, status, lan, ap, apply, refresh: reload, applying: isBusy('apply'), applyError: errorOf('apply') };
};

export { useArchipeliaServers };
