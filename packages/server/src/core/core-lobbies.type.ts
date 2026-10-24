/* @layer core @kind types */
import type { DataFiles, EngineRuntime, SessionEngine } from '@archipelia/model';
import type { SessionService } from '@archipelia/sessions';
import type { SandboxRunner } from '../sandbox/sandbox.type';
import type { CorePorts } from './core-ports.type';

type CoreLobbyDeps = {
  ports: CorePorts;
  sessions: () => SessionService;
  runtime: () => Promise<EngineRuntime>;
  runtimeFor: (engine: SessionEngine) => Promise<EngineRuntime | undefined>;
  sessionFiles: DataFiles;
  sandbox: () => Promise<SandboxRunner>;
};

export type { CoreLobbyDeps };
