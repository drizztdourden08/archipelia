/* @layer electron-main @kind types */
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import type { EngineRuntime } from '@archipelia/model';
import type { ServerStore } from './server-store.type';

type SecretStore = { get: (name: string) => Promise<string | null>; set: (name: string, value: string, label?: string) => Promise<void> };

type HostFactoryDeps = { ctx: MainContext; runtime: () => Promise<EngineRuntime>; secrets: SecretStore; servers: ServerStore };

export type { HostFactoryDeps, SecretStore };
