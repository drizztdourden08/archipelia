/* @layer core @kind types */
import type { StartJob } from '@drizztdourden08/brock-core/jobs';
import type { FetchLike } from '@archipelia/engine';
import type { SecretStore } from '@archipelia/hosts';
import type { DataFiles, EngineEvent } from '@archipelia/model';
import type { SessionEvent } from '@archipelia/sessions';

type CoreDomain = DataFiles & {
  dir: () => string;
  size: (rel?: string) => Promise<number>;
};

type CoreDomains = { domain: (id: string) => CoreDomain };

type CoreEvent =
  | { kind: 'engine'; event: EngineEvent }
  | { kind: 'session'; event: SessionEvent };

type CoreLogLevel = 'info' | 'warn' | 'error';

type CoreNetwork = {
  automation: boolean;
  lanHost: () => string;
};

type CoreEnvironment = {
  fetch?: FetchLike;
  platform?: string;
  target?: string;
};

type CorePorts = {
  domain: CoreDomains['domain'];
  job: StartJob;
  emit: (event: CoreEvent) => void;
  secrets: SecretStore;
  log: (message: string, level?: CoreLogLevel) => void;
  network: CoreNetwork;
  environment?: CoreEnvironment;
};

export type { CoreDomain, CoreDomains, CoreEnvironment, CoreEvent, CoreLogLevel, CoreNetwork, CorePorts };
