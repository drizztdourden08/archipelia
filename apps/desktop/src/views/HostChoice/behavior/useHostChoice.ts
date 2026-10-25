/* @layer renderer-app @kind hook */
import { useCallback, useMemo, useState } from 'react';
import { confirmAction, nav, useKeyedGuard } from '@drizztdourden08/brock-react';
import type { NetworkMode } from '@archipelia/server/network';
import { failWith } from '../../../hooks/fail-with';
import { ROUTE } from '../../../hooks/app-navigation.constants';
import { useActiveServer } from '../../../hooks/useActiveServer';
import { useLocalServerStatus } from '../../../hooks/useLocalServerStatus';
import { appApi } from '../../../ipc/app-api';
import { LOCAL_SERVER } from '../../../lobbies/lobbies.constants';
import { serverPlace } from '../../../lobbies/server-place';
import { FAILURE, OPEN_LAN } from '../HostChoice.constants';
import type { HostWhere } from '../HostChoice.type';
import { chooseWhere } from './choose-where';

const useHostChoice = () => {
  const { serverId, entries, select } = useActiveServer();
  const { status, setStatus } = useLocalServerStatus();
  const { guard, isBusy, errorOf } = useKeyedGuard();
  const [wantsRemote, setWantsRemote] = useState(false);

  const place = useMemo(() => serverPlace(serverId, entries, status), [serverId, entries, status]);
  const where = chooseWhere(serverId, wantsRemote, status);

  const setMode = useCallback(
    (mode: NetworkMode) => guard('mode', failWith(FAILURE.mode, async () => {
      if (status) setStatus(await appApi().lobbyServerApply({ ...status.options, mode }));
    })),
    [guard, setStatus, status],
  );

  const openLan = async () => {
    if (!status) return;
    if (status.options.mode === 'off') {
      const open = await confirmAction(OPEN_LAN);
      if (!open) return;
      await setMode('lan');
    }
    setWantsRemote(false);
    select(LOCAL_SERVER);
  };

  const choose = (next: HostWhere) => {
    if (next === 'lan') {
      void openLan();
      return;
    }
    if (next === 'private') {
      setWantsRemote(false);
      select(LOCAL_SERVER);
      if (status && status.options.mode !== 'off') void setMode('off');
      return;
    }
    setWantsRemote(true);
    const first = entries[0];
    if (first && serverId === LOCAL_SERVER) select(first.id);
  };

  return {
    where, serverId, entries, place, status,
    ready: status !== null,
    busy: isBusy('mode'),
    error: errorOf('mode'),
    stillOpen: where === 'remote' && status !== null && status.options.mode !== 'off',
    choose,
    pickServer: select,
    stop: () => void setMode('off'),
    manageServers: () => nav.open(ROUTE.archipeliaServers),
  };
};

export { useHostChoice };
