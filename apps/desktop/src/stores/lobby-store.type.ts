/* @layer renderer-app @kind types */
import type { AdminLobby } from '@archipelia/model';
import type { LobbyEvent, LobbyRequest } from '../lobbies/lobbies.type';

type LobbyState = {
  serverId: string;
  lobbies: Record<string, AdminLobby[]>;
  select: (serverId: string) => void;
  load: (serverId: string) => Promise<void>;
  act: (serverId: string, request: LobbyRequest) => Promise<AdminLobby>;
  apply: (event: LobbyEvent) => void;
};

export type { LobbyState };
