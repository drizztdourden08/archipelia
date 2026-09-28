/* @layer core @kind types */
import type { EngineRuntime, HostTarget } from '@archipelia/model';
import type { HostLogLine, SessionHost } from '@archipelia/hosts';
import type { PlayerDeps } from '../players/write-players.type';
import type { RunStore } from '../store/session-stores.type';
import type { SessionEvent } from './session-event.type';

type ServiceDeps = PlayerDeps & {
  dataRoot: string;
  runtime: () => Promise<EngineRuntime>;
  runs: RunStore;
  hostFor: (target: HostTarget) => Promise<SessionHost>;
  resolveSecret: (ref: string) => Promise<string | null>;
  emit: (event: SessionEvent) => void;
};

type LiveSession = { host: SessionHost; log: HostLogLine[] };

export type { LiveSession, ServiceDeps };
