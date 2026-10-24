/* @layer testing @kind types */
import type { Transport, TransportEvent } from '../../node/transport/transport.type';
import type { Bindings, FixtureLine, HostHook, ScenarioFile } from '../scenario/scenario.type';

type PeerRole = 'client' | 'server';

type Queue<T> = { push: (item: T) => void; pull: () => Promise<T> };

type PeerIo = {
  open: () => Promise<Transport>;
  reopen: (current: Transport) => Promise<Transport>;
};

type PlayOptions = {
  role: PeerRole;
  lines: FixtureLine[];
  io: PeerIo;
  values: Bindings;
  files: ScenarioFile[];
  timeoutMs: number;
  host?: HostHook;
  ignore: string[];
};

type PeerState = {
  transport: Transport;
  inbox: Queue<TransportEvent>;
  welcomed: boolean;
  maxBytes: number;
  chunkBytes: number;
};

type PeerContext = { options: PlayOptions; bindings: Bindings; state: PeerState };

export type { PeerContext, PeerState, PlayOptions, Queue };
