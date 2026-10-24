/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { serverPlace } from '../lobbies/server-place';
import { useLobbyServerEntries } from './useLobbyServerEntries';
import { useLocalServerStatus } from './useLocalServerStatus';

const useServerPlace = (serverId: string) => {
  const { entries } = useLobbyServerEntries();
  const { status } = useLocalServerStatus();
  return useMemo(() => serverPlace(serverId, entries, status), [serverId, entries, status]);
};

export { useServerPlace };
