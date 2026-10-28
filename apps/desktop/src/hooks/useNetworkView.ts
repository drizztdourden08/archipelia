/* @layer renderer-app @kind hook */
import { useEffect, useMemo } from 'react';
import type { SessionTemplate } from '@archipelia/model';
import { LOCAL_SERVER } from '../lobbies/lobbies.constants';
import { serverPlace } from '../lobbies/server-place';
import { tabFacts } from '../lobbies/tab-facts';
import type { NetworkView } from '../stores/session-view-store.type';
import { useLobbyStore } from '../stores/useLobbyStore';
import { STATUS_POLL_MS } from './lobby-hooks.constants';
import { useLobbyServerEntries } from './useLobbyServerEntries';
import { useLocalServerStatus } from './useLocalServerStatus';

const useNetworkView = (draft: SessionTemplate | undefined, serverId: string): NetworkView => {
  const { status, reload } = useLocalServerStatus();
  const { entries, reload: reloadEntries } = useLobbyServerEntries();
  const local = useLobbyStore((state) => state.lobbies[LOCAL_SERVER]);

  useEffect(() => { void reload(); }, [local, reload]);
  useEffect(() => {
    const timer = setInterval(() => { void reload(); void reloadEntries(); }, STATUS_POLL_MS);
    return () => clearInterval(timer);
  }, [reload, reloadEntries]);

  const names = useMemo(() => Object.fromEntries((local ?? []).map((lobby) => [lobby.id, lobby.name])), [local]);
  const facts = useMemo(
    () => (draft ? tabFacts(draft, status, serverPlace(serverId, entries, status), entries.find((entry) => entry.id === serverId)) : []),
    [draft, entries, serverId, status],
  );
  return useMemo(() => ({ status, names, facts }), [facts, names, status]);
};

export { useNetworkView };
