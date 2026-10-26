/* @layer renderer-app @kind hook */
import type { DirectConnection } from '@archipelia/model';
import { connectedCount } from '../lobbies/connected-count';
import { useLobbyStore } from '../stores/useLobbyStore';

const useConnectedCount = (direct: DirectConnection | undefined): number =>
  useLobbyStore((state) => (direct?.lobbyId ? connectedCount(state.lobbies[direct.serverId]?.find((lobby) => lobby.id === direct.lobbyId)) : 0));

export { useConnectedCount };
