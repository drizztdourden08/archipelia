/* @layer core @kind types */
import type { createLobbyService } from './create-lobby-service';

type LobbyService = ReturnType<typeof createLobbyService>;

type LobbyProtocol = LobbyService['protocol'];

export type { LobbyProtocol, LobbyService };
