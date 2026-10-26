/* @layer renderer-app @kind logic */
import type { GameSectionRows, GameTab } from '../GameStore.type';

const gridSectionsOf = (sections: GameSectionRows[], tab: GameTab, filtered: boolean): GameSectionRows[] =>
  sections.filter(({ id, rows }) => rows.length > 0 || (tab === 'all' && id === 'installed' && !filtered));

export { gridSectionsOf };
