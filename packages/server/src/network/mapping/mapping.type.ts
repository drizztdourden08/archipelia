/* @layer core @kind types */
import type { NetworkPorts } from '../ports/network-ports.type';

type MapProtocol = 'tcp' | 'udp';

type MapMethod = 'pcp' | 'nat-pmp' | 'upnp';

type ExternalAddress = { address: string | null; port: number };

type UpnpClientLike = {
  createMapping: (options: { public: number; private: number; protocol: string; description: string; ttl: number }) => Promise<unknown>;
  removeMapping: (options: { public: number; protocol: string }) => Promise<unknown>;
  getPublicIp: () => Promise<string>;
  close: () => void;
};

type MappingPorts = Pick<NetworkPorts, 'interfaces' | 'openUdp'> & {
  createUpnp: () => UpnpClientLike;
  lookupPublicAddress?: () => Promise<string | null>;
  retryDelaysMs?: number[];
};

type MapRequest = {
  port: number;
  protocol: MapProtocol;
  ttl: number;
  description: string;
  ports: MappingPorts;
};

type MapperRenewal = { ok: true; external: ExternalAddress; lifetime: number } | { ok: false; detail: string };

type MapperSession = {
  external: ExternalAddress;
  lifetime: number;
  renew: () => Promise<MapperRenewal>;
  release: () => Promise<void>;
};

type MapperOutcome = { ok: true; session: MapperSession } | { ok: false; kind: 'absent' | 'refused'; detail: string };

type Mapper = { method: MapMethod; open: (request: MapRequest) => Promise<MapperOutcome> };

type CgnatKind = 'shared-range' | 'private-range' | 'public-mismatch';

type CgnatReport = { kind: CgnatKind; address: string; publicAddress: string | null };

type MapAttempt = { method: MapMethod; outcome: 'absent' | 'refused' | 'error'; detail: string };

type MappingState = { mapped: boolean; method: MapMethod; external: ExternalAddress | null; message: string };

type RenewalOptions = {
  method: MapMethod;
  session: MapperSession;
  onChange?: (state: MappingState) => void;
};

type MapPortOptions = {
  port: number;
  protocol: MapProtocol;
  ttl: number;
  automation: boolean;
  ports: MappingPorts;
  description?: string;
  onChange?: (state: MappingState) => void;
};

type PortMapResult =
  | {
      ok: true;
      method: MapMethod;
      external: ExternalAddress;
      ttl: number;
      message: string;
      state: () => MappingState;
      stop: () => Promise<void>;
    }
  | {
      ok: false;
      reason: 'automation' | 'no-router' | 'refused' | 'cgnat';
      message: string;
      attempts: MapAttempt[];
      cgnat: CgnatReport | null;
      stop: () => Promise<void>;
    };

export type {
  CgnatKind,
  CgnatReport,
  ExternalAddress,
  MapAttempt,
  MapMethod,
  MapPortOptions,
  MapProtocol,
  MapRequest,
  Mapper,
  MapperOutcome,
  MappingPorts,
  MappingState,
  PortMapResult,
  RenewalOptions,
  UpnpClientLike,
};
