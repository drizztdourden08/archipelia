/* @layer core @kind logic */
import { lineCandidates } from './line-candidates';
import { pickCandidate } from './pick-candidate';
import { placementKey } from './placement-key';
import { SPHERE_OPEN } from './spoiler.constants';
import type { Block, SpoilerPlacement, SpoilerSphere } from './spoiler.type';

const blocksOf = (lines: readonly string[]): Block[] => {
  const blocks: Block[] = [];
  let open: Block | null = null;
  lines.forEach((line) => {
    const start = SPHERE_OPEN.exec(line);
    if (start) {
      open = { index: Number(start[1]), lines: [] };
      blocks.push(open);
    } else if (line.trim() === '}') open = null;
    else if (open && line.trim() !== '') open.lines.push(line.trim());
  });
  return blocks;
};

const parsePlaythrough = (lines: readonly string[], placements: SpoilerPlacement[], names: readonly string[]): SpoilerSphere[] => {
  const byKey = new Map(placements.map((placement) => [placementKey(placement.finder, placement.location), placement]));
  const context = { names, locations: new Set(placements.map((placement) => placement.location)), items: new Set<string>() };
  return blocksOf(lines).map(({ index, lines: rows }) => {
    const members: SpoilerPlacement[] = [];
    rows.forEach((row) => {
      const split = pickCandidate(lineCandidates(row, names), context);
      if (!split) return;
      const key = placementKey(split.finder, split.location);
      let placement = byKey.get(key);
      if (!placement) {
        placement = { ...split, id: placements.length, sphere: null, required: false };
        placements.push(placement);
        byKey.set(key, placement);
      }
      placement.sphere = index;
      placement.required = true;
      members.push(placement);
    });
    return { index, placements: members };
  });
};

export { parsePlaythrough };
