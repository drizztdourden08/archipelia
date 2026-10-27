/* @layer renderer-app @kind hook */
import type { LiveTab } from '../live/live.type';
import { connectedCount } from '../lobbies/connected-count';
import { useLobbyStore } from '../stores/useLobbyStore';

const useConnectedCount = ({ serverId, lobbyId }: Pick<LiveTab, 'serverId' | 'lobbyId'>): number =>
  useLobbyStore((state) => connectedCount(state.lobbies[serverId]?.find((entry) => entry.id === lobbyId)));

export { useConnectedCount };
