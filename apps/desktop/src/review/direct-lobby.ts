/* @layer renderer-app @kind logic */
import type { AdminLobby } from '@archipelia/model';
import { LOCAL_SERVER } from '../lobbies/lobbies.constants';
import { useLobbyStore } from '../stores/useLobbyStore';
import { REVIEW_DIRECT } from './review.constants';

const directLobby = (lobbyId?: string): AdminLobby | undefined =>
  useLobbyStore.getState().lobbies[LOCAL_SERVER]?.find((lobby) => (lobbyId ? lobby.id === lobbyId : lobby.name === REVIEW_DIRECT && lobby.phase !== 'closed'));

export { directLobby };
