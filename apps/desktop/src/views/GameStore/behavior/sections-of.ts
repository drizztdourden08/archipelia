/* @layer renderer-app @kind logic */
import { groupSections } from './group-sections';
import { sectionOfSource } from './section-of-source';
import type { GameRow, GameSectionRows, GameTab } from '../GameStore.type';

const inTab = (row: GameRow, tab: Exclude<GameTab, 'all'>) => {
  if (tab === 'installed') return row.state !== 'available';
  if (tab === 'updates') return row.state === 'update';
  return sectionOfSource(row.entry.source) === tab;
};

const sectionsOf = (rows: GameRow[], tab: GameTab): GameSectionRows[] =>
  (tab === 'all' ? groupSections(rows) : [{ id: tab, rows: rows.filter((row) => inTab(row, tab)) }]);

export { sectionsOf };
