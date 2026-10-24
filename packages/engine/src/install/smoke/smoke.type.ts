/* @layer core @kind types */
import type { EngineRuntime, SmokeResult } from '@archipelia/model';

type SmokeCheck = NonNullable<SmokeResult['failed']>;

type SmokeInput = { runtime: EngineRuntime; carried: string[]; signal: AbortSignal; log: (line: string) => void };

type SmokeOutcome = { result: SmokeResult; broken: string[]; error?: string };

type SmokeWorld = { game: string; remove: () => Promise<void> };

type SchemaCheck = { loaded: string[]; errors: Record<string, string> };

type SeedRequest = { runtime: EngineRuntime; dir: string; game: string; signal: AbortSignal; log: (line: string) => void };

type SeedResult = { seedFile: string; warnings: string[] };

type HostRequest = { runtime: EngineRuntime; dir: string; seedFile: string; signal: AbortSignal; log: (line: string) => void };

type SmokeDeps = {
  placeWorld: (runtime: EngineRuntime, carried: string[]) => Promise<SmokeWorld>;
  readSchemas: (runtime: EngineRuntime, games: string[]) => Promise<SchemaCheck>;
  generateSeed: (request: SeedRequest) => Promise<SeedResult>;
  hostSeed: (request: HostRequest) => Promise<void>;
  clearWork: (dir: string) => Promise<void>;
  now: () => number;
};

export type { HostRequest, SmokeCheck, SchemaCheck, SeedRequest, SeedResult, SmokeDeps, SmokeInput, SmokeOutcome, SmokeWorld };
