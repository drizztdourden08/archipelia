/* @layer core @kind logic */
import { lineCandidates } from './line-candidates';
import { pickCandidate } from './pick-candidate';
import type { LineContext, SpoilerPlacement } from './spoiler.type';

type ParsedPlacements = { placements: SpoilerPlacement[]; unparsed: string[] };

const itemsOfUnique = (candidates: readonly (readonly { item: string }[])[]) =>
  new Set(candidates.filter((found) => found.length === 1).map((found) => found[0]?.item ?? ''));

const parsePlacements = (lines: readonly string[], base: Omit<LineContext, 'items'>): ParsedPlacements => {
  const rows = lines.filter((line) => line.trim() !== '');
  const candidates = rows.map((line) => lineCandidates(line, base.names));
  const context: LineContext = { ...base, items: itemsOfUnique(candidates) };
  const placements: SpoilerPlacement[] = [];
  const unparsed: string[] = [];
  rows.forEach((line, at) => {
    const split = pickCandidate(candidates[at] ?? [], context);
    if (split) placements.push({ ...split, id: placements.length, sphere: null, required: false });
    else unparsed.push(line);
  });
  return { placements, unparsed };
};

export { parsePlacements };
export type { ParsedPlacements };
