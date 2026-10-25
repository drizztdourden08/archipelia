/* @layer renderer-app @kind logic */
import type { GameEnrichment } from '@archipelia/catalog';
import type { GameCardProps } from '@archipelia/design';

const enrichProps = (found: GameEnrichment | undefined): Pick<GameCardProps, 'art' | 'summary' | 'summaryHint'> => {
  if (!found) return {};
  return {
    summary: found.summary,
    ...(found.details ? { summaryHint: found.details } : {}),
    ...(found.art ? { art: found.art } : {}),
  };
};

export { enrichProps };
