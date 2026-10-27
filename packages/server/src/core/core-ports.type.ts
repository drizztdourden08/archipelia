/* @layer core @kind types */
import type { StartJob } from '@drizztdourden08/brock-core/jobs';
import type { BuildRunner, ToolRunner } from '@archipelia/catalog';
import type { FetchLike } from '@archipelia/engine';
import type { RoomVault } from './room-secrets/room-secrets.type';
import type { DataFiles, EngineEvent, Lobby, Session, SessionTemplate } from '@archipelia/model';
import type { LobbyRun, SessionEvent } from '@archipelia/sessions';

type CoreDomain = DataFiles & {
  dir: () => string;
  size: (rel?: string) => Promise<number>;
};

type CoreDomains = { domain: (id: string) => CoreDomain };

type CoreEvent =
  | { kind: 'engine'; event: EngineEvent }
  | { kind: 'session'; event: SessionEvent }
  | { kind: 'lobby'; lobby: Lobby };

type CoreLogLevel = 'info' | 'warn' | 'error';

type CoreNetwork = {
  automation: boolean;
  lanHost: () => string;
};

type CoreEnvironment = {
  fetch?: FetchLike;
  platform?: string;
  target?: string;
  version?: string;
};

type CoreLobbyRunContext = { output: DataFiles; report: (event: SessionEvent) => void };

type CoreLobbyRun = (template: SessionTemplate, lobby: LobbyRun, context: CoreLobbyRunContext) => Promise<Session>;

type CorePorts = {
  domain: CoreDomains['domain'];
  job: StartJob;
  emit: (event: CoreEvent) => void;
  secrets: RoomVault;
  log: (message: string, level?: CoreLogLevel) => void;
  network: CoreNetwork;
  environment?: CoreEnvironment;
  lobbyRun?: CoreLobbyRun;
  canStoreSecrets?: () => boolean;
  build?: BuildRunner;
  tool?: ToolRunner;
};

export type { CoreDomain, CoreDomains, CoreEnvironment, CoreEvent, CoreLobbyRun, CoreLobbyRunContext, CoreLogLevel, CoreNetwork, CorePorts };
