/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useState } from 'react';
import { useKeyedGuard } from '@drizztdourden08/brock-react';
import { failWith } from '../../../hooks/fail-with';
import { appApi } from '../../../ipc/app-api';
import type { LobbyServerStatus } from '../../../lobbies/lobbies.type';
import type { NetworkView } from '../../../stores/session-view-store.type';
import { useServerStatusStore } from '../../../stores/useServerStatusStore';
import { FAILURE } from '../ArchipeliaServers.constants';
import { reachFacts } from './reach-facts';

const useNetworkWidget = ({ status: shared, names }: NetworkView) => {
  const [fresh, setFresh] = useState<LobbyServerStatus | null>(null);
  const setStatus = useServerStatusStore((state) => state.setStatus);
  const { guard, isBusy, errorOf } = useKeyedGuard();
  const status = fresh ?? shared;

  useEffect(() => { setFresh(null); }, [shared]);

  const stop = useCallback(() => {
    if (!status) return;
    void guard('stop', failWith(FAILURE.apply, async () => {
      const next = await appApi().lobbyServerApply({ ...status.options, mode: 'off' });
      setFresh(next);
      setStatus(next);
    }));
  }, [guard, setStatus, status]);

  return {
    status,
    facts: status ? reachFacts(status, names) : [],
    open: status !== null && status.options.mode !== 'off' && !status.automation,
    busy: isBusy('stop'),
    error: errorOf('stop'),
    stop,
  };
};

export { useNetworkWidget };
