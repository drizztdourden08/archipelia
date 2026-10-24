/* @layer core @kind types */
import type { DataFiles } from '@archipelia/model';
import type { Registry } from './registry.type';

type RegistrySource = 'network' | 'cache' | 'floor';

type RegistryLoad = { registry: Registry; source: RegistrySource; fetchedAt: number | null; problems: string[] };

type RegistryCache = { etag: string | null; fetchedAt: number; registry: unknown };

type LoadRegistryDeps = {
  files: DataFiles;
  fetch?: typeof fetch;
  now?: () => number;
  url?: string;
  floor?: () => Registry;
};

type LoadRegistryOptions = { force?: boolean };

type RegistryFetch = { kind: 'fresh'; registry: Registry; raw: unknown; etag: string | null } | { kind: 'same' };

type RefreshRegistryParams = {
  files: DataFiles;
  stored: { cache: RegistryCache; registry: Registry } | null;
  now: () => number;
  got: RegistryFetch;
};

type FallbackParams = {
  stored: { cache: RegistryCache; registry: Registry } | null;
  floor: () => Registry;
  error: unknown;
};

export type { FallbackParams, LoadRegistryDeps, LoadRegistryOptions, RefreshRegistryParams, RegistryCache, RegistryFetch, RegistryLoad, RegistrySource };
