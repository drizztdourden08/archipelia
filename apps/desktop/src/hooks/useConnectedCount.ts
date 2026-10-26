/* @layer renderer-app @kind hook */
import type { SessionTemplate } from '@archipelia/model';
import { connectedCount } from '../lobbies/connected-count';
import { useLobbyStore } from '../stores/useLobbyStore';

const useConnectedCount = ({ lobby }: Pick<SessionTemplate, 'lobby'>): number =>
  useLobbyStore((state) => (lobby?.lobbyId ? connectedCount(state.lobbies[lobby.serverId]?.find((entry) => entry.id === lobby.lobbyId)) : 0));

export { useConnectedCount };
