/* @layer renderer-app @kind logic */
import { MIXED_SECTIONS } from '../GameStore.constants';
import { sectionOfSource } from './section-of-source';
import type { GameRow, GameSectionId, GameSectionRows } from '../GameStore.type';

const sectionOf = ({ state, entry }: GameRow): GameSectionId | null => (state !== 'available' ? 'installed' : sectionOfSource(entry.source));

const groupSections = (rows: GameRow[]): GameSectionRows[] =>
  MIXED_SECTIONS.map((id) => ({ id, rows: rows.filter((row) => sectionOf(row) === id) }));

export { groupSections };
