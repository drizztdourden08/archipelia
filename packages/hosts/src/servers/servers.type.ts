/* @layer core @kind types */
import type { EngineRuntime, ServerEntry, ServerTest } from '@archipelia/model';

type SecretReader = { get: (name: string) => Promise<string | null> };

type SecretStore = SecretReader & { set: (name: string, value: string, label?: string) => Promise<void> };

type ServerLookup = { require: (id: string) => Promise<ServerEntry> };

type ServerSaver = { save: (entry: ServerEntry) => Promise<ServerEntry> };

type ServerTestResult = ServerTest & { hostKey?: string };

type HostFactoryDeps = {
  runtime: () => Promise<EngineRuntime>;
  secrets: SecretStore;
  servers: ServerLookup;
  advertiseHost: () => string;
  ggOwnerSecret: string;
};

export type { HostFactoryDeps, SecretReader, SecretStore, ServerLookup, ServerSaver, ServerTestResult };
