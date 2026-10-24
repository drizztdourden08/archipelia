/* @layer core @kind types */
import type { Lobby } from '@archipelia/model';
import type { MappingPorts, NetworkMode, NetworkPorts, PortMapResult } from '../../network';

type ReachPorts = { network: NetworkPorts; mapping: MappingPorts };

type ReachInput = {
  port: number;
  mode: NetworkMode;
  automation: boolean;
  ports: ReachPorts;
  server: { id: string; name: string };
  lobbies: () => Promise<Lobby[]>;
  fallbackAp: () => Promise<string | undefined>;
  watch: (listener: (lobby: Lobby) => void) => () => void;
  log: (message: string) => void;
};

type ReachStatus = { mode: NetworkMode; advertising: boolean; lobbyPort: string | null; rooms: Record<string, string> };

type RoomMapping = { port: number; result: Promise<PortMapResult> };

export type { ReachInput, ReachPorts, ReachStatus, RoomMapping };
