/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useKeyedGuard } from '@drizztdourden08/brock-react';
import { failWith } from '../../../hooks/fail-with';
import { openLobby } from '../../../hooks/open-lobby';
import { useActiveServer } from '../../../hooks/useActiveServer';
import { useLocalServerStatus } from '../../../hooks/useLocalServerStatus';
import { serverPlace } from '../../../lobbies/server-place';
import { useLobbyStore } from '../../../stores/useLobbyStore';
import { FAILURE } from '../LobbyList.constants';
import { serverNotice } from './server-notice';
import { serverOptions } from './server-options';

const useLobbyList = () => {
  const { serverId, entries, select } = useActiveServer();
  const load = useLobbyStore((state) => state.load);
  const { status } = useLocalServerStatus();
  const { guard, errorOf, isBusy } = useKeyedGuard();
  const [opened, setOpened] = useState(false);

  const lobbies = useLobbyStore((state) => state.lobbies[serverId]);
  const place = useMemo(() => serverPlace(serverId, entries, status), [serverId, entries, status]);

  const reload = useCallback(() => guard('load', failWith(FAILURE.load, () => load(serverId))), [guard, load, serverId]);
  useEffect(() => { void reload().finally(() => setOpened(true)); }, [reload]);
  const open = useCallback((lobbyId: string) => openLobby(serverId, lobbyId), [serverId]);

  return {
    serverId, place, select, reload,
    options: serverOptions(entries),
    notice: serverNotice(place.local, status),
    lobbies: lobbies ?? [],
    loading: !opened || isBusy('load'),
    error: errorOf('load'),
    open,
  };
};

export { useLobbyList };
