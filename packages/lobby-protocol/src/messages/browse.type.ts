/* @layer protocol @kind types */
import type { LobbyAdmission } from '../protocol/protocol.type';
import type { ProtocolOffer } from './hello.type';
import type { EngineRef, OpenSeats } from './server.type';

type LobbyBrowseRequest = {
  type: 'lobby.browse';
  seq?: number;
  protocol: ProtocolOffer;
};

type BrowsedLobby = {
  name: string;
  joinToken: string;
  engine: EngineRef;
  admission: LobbyAdmission;
  allowUnlisted: boolean;
  joinable: boolean;
  seats: OpenSeats;
};

type LobbyBrowseReply = {
  type: 'lobby.browse.reply';
  re?: number;
  protocol: { name: string; version: number };
  server: { name: string; version: string };
  lobbies: BrowsedLobby[];
};

export type { BrowsedLobby, LobbyBrowseReply, LobbyBrowseRequest };
