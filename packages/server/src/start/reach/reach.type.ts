/* @layer core @kind types */
import type { Lobby } from '@archipelia/model';
import type { MappingPorts, NetworkMode, NetworkPorts, PortMapResult, PublicLookup } from '../../network';

type ReachPorts = { network: NetworkPorts; mapping: MappingPorts; lookup?: PublicLookup | null };

type ReachInput = {
  port: number;
  secure: boolean;
  mode: NetworkMode;
  automation: boolean;
  ports: ReachPorts;
  server: { id: string; name: string };
  lobbies: () => Promise<Lobby[]>;
  fallbackAp: () => Promise<string | undefined>;
  watch: (listener: (lobby: Lobby) => void) => () => void;
  log: (message: string) => void;
};

type ReachStatus = { mode: NetworkMode; advertising: boolean; lobbyPort: string | null; publicAddress: string | null; rooms: Record<string, string> };

type RoomMapping = { port: number; result: Promise<PortMapResult> };

export type { ReachInput, ReachPorts, ReachStatus, RoomMapping };
