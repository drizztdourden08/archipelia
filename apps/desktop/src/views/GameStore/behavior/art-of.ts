/* @layer renderer-app @kind logic */
import type { GameEnrichment } from '@archipelia/catalog';

const artOf = (found: GameEnrichment | undefined): { art?: string } => (found?.art ? { art: found.art } : {});

export { artOf };
