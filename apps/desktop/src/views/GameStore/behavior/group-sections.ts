/* @layer renderer-app @kind logic */
import { MIXED_SECTIONS } from '../GameStore.constants';
import type { GameRow, GameSectionId, GameSectionRows } from '../GameStore.type';

const sectionOf = ({ state, entry }: GameRow): GameSectionId => {
  if (state !== 'available') return 'installed';
  return entry.source === 'official' ? 'official' : 'community';
};

const groupSections = (rows: GameRow[]): GameSectionRows[] =>
  MIXED_SECTIONS.map((id) => ({ id, rows: rows.filter((row) => sectionOf(row) === id) }));

export { groupSections };
