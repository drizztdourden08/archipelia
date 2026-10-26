/* @layer renderer-app @kind logic */
import type { GameEnrichment } from '@archipelia/catalog';
import type { GameDetailsProps } from '@archipelia/design';

const textOf = (found: GameEnrichment | undefined): Pick<GameDetailsProps, 'markdown'> =>
  (found?.markdown ? { markdown: found.markdown } : {});

export { textOf };
