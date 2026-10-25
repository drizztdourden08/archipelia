/* @layer electron-main @kind types */
import type { AdminLobby, SessionPlayer } from '@archipelia/model';
import type { HostPlayerSlot, LobbyRequest } from '../../src/lobbies/lobbies.type';

type DirectRunDeps = {
  act: (request: LobbyRequest) => Promise<AdminLobby>;
  list: () => Promise<AdminLobby[]>;
  slotOf: (player: SessionPlayer) => Promise<HostPlayerSlot>;
};

export type { DirectRunDeps };
