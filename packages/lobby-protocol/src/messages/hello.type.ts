/* @layer protocol @kind types */
import type { PlatformArch, PlatformOs } from '../protocol/protocol.type';

type ProtocolOffer = { name: string; versions: number[] };

type ClientInfo = {
  id: string;
  name: string;
  version: string;
  build?: string;
  platform: { os: PlatformOs; arch: PlatformArch };
  homepage?: string;
  sdk?: { name: string; version: string };
};

type WorldProof =
  | { method: 'github-attestation'; bundle: Record<string, unknown> }
  | { method: 'none' }
  | { method: 'ed25519'; keyId: string; signature: string };

type WorldEntry = {
  game: string;
  module: string;
  worldVersion: string;
  sha256: string;
  size: number;
  proof?: WorldProof;
};

type SlotEntry = { name: string; game: string; yaml: { sha256: string; size: number } };

type LobbyInfoRequest = {
  type: 'lobby.info';
  seq?: number;
  protocol: ProtocolOffer;
  lobby: { code: string };
};

type Hello = {
  type: 'hello';
  seq?: number;
  protocol: ProtocolOffer;
  lobby: { code: string };
  resume?: string | null;
  client: ClientInfo;
  player: { displayName: string };
  archipelago: { version: string };
  capabilities: string[];
  worlds: WorldEntry[];
  slots: SlotEntry[];
};

export type { ClientInfo, Hello, LobbyInfoRequest, ProtocolOffer, SlotEntry, WorldEntry, WorldProof };
