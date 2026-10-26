/* @layer renderer-app @kind logic */
import type { GameEnrichment } from '@archipelia/catalog';
import type { GameDetailsProps } from '@archipelia/design';

const textOf = (found: GameEnrichment | undefined): Pick<GameDetailsProps, 'summary' | 'details'> => {
  if (!found) return {};
  return { summary: found.summary, ...(found.details ? { details: found.details } : {}) };
};

export { textOf };
