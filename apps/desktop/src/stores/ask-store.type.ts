/* @layer renderer-app @kind types */
import type { EnrichRequest } from '@archipelia/catalog';

type AskState<T> = {
  asked: Record<string, true>;
  found: Record<string, T>;
  ask: (request: EnrichRequest) => void;
};

type AskOptions<T> = {
  load: (request: EnrichRequest) => Promise<T | undefined>;
  failed?: T;
  again?: (found: T) => boolean;
};

export type { AskOptions, AskState };
