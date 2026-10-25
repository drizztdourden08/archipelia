/* @layer core @kind types */
import type { EngineRuntime, HostTarget, SessionEngine } from '@archipelia/model';
import type { HostBinding, HostLogLine, SessionHost } from '@archipelia/hosts';
import type { PlayerDeps } from '../players/write-players.type';
import type { RunStore } from '../store/session-stores.type';
import type { SessionEvent } from './session-event.type';

type ServiceDeps = PlayerDeps & {
  runtime: () => Promise<EngineRuntime>;
  runs: RunStore;
  runtimeFor?: (engine: SessionEngine) => Promise<EngineRuntime | undefined>;
  remoteApVersion?: (serverId: string) => Promise<string | undefined>;
  hostFor: (target: HostTarget, runtime?: EngineRuntime, binding?: HostBinding) => Promise<SessionHost>;
  lobbyBinding?: () => HostBinding;
  resolveSecret: (ref: string) => Promise<string | null>;
  emit: (event: SessionEvent) => void;
};

type LiveSession = { host: SessionHost; log: HostLogLine[] };

export type { LiveSession, ServiceDeps };
