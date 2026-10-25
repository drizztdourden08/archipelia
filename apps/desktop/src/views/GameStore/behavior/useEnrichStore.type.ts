/* @layer renderer-app @kind types */
import type { EnrichRequest, GameEnrichment } from '@archipelia/catalog';

type EnrichState = {
  asked: Record<string, true>;
  found: Record<string, GameEnrichment>;
  ask: (request: EnrichRequest) => void;
};

export type { EnrichState };
