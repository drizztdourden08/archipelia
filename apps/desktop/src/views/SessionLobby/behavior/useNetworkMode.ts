/* @layer renderer-app @kind hook */
import { useCallback } from 'react';
import { useKeyedGuard } from '@drizztdourden08/brock-react';
import type { NetworkMode } from '@archipelia/server/network';
import { failWith } from '../../../hooks/fail-with';
import { useLocalServerStatus } from '../../../hooks/useLocalServerStatus';
import { appApi } from '../../../ipc/app-api';
import { MODE_FAILURE } from './lobby-view.constants';

const useNetworkMode = () => {
  const { status, setStatus } = useLocalServerStatus();
  const { guard, isBusy, errorOf } = useKeyedGuard();

  const setMode = useCallback(
    (mode: NetworkMode) => guard('mode', failWith(MODE_FAILURE, async () => {
      if (status) setStatus(await appApi().lobbyServerApply({ ...status.options, mode }));
    })),
    [guard, setStatus, status],
  );

  return { status, mode: status?.options.mode, setMode, busy: isBusy('mode'), error: errorOf('mode') };
};

export { useNetworkMode };
