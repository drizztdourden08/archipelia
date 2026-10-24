/* @layer renderer-app @kind hook */
import { useLobbyStore } from '../stores/useLobbyStore';
import { LOCAL_SERVER } from '../lobbies/lobbies.constants';
import { useLobbyServerEntries } from './useLobbyServerEntries';

const useActiveServer = () => {
  const stored = useLobbyStore((state) => state.serverId);
  const select = useLobbyStore((state) => state.select);
  const { entries, loaded } = useLobbyServerEntries();
  const gone = loaded && stored !== LOCAL_SERVER && !entries.some((entry) => entry.id === stored);
  return { serverId: gone ? LOCAL_SERVER : stored, entries, select };
};

export { useActiveServer };
