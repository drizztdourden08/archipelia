/* @layer renderer-app @kind logic */
import type { GameRow, GameTab } from '../GameStore.type';

const inTab = (row: GameRow, tab: GameTab) => {
  if (tab === 'installed') return row.state !== 'available';
  if (tab === 'updates') return row.state === 'update';
  if (tab === 'official') return row.entry.source === 'official';
  return row.entry.source === 'index';
};

const filterRows = (rows: GameRow[], tab: GameTab, query: string) => {
  const needle = query.trim().toLowerCase();
  return rows
    .filter((row) => inTab(row, tab))
    .filter((row) => !needle || `${row.entry.displayName} ${row.entry.game} ${row.entry.apworld}`.toLowerCase().includes(needle))
    .sort((a, b) => a.entry.displayName.localeCompare(b.entry.displayName));
};

export { filterRows };
