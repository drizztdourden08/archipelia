/* @layer core @kind logic */
import type { LineContext, SplitLine } from './spoiler.type';

const pickCandidate = (found: readonly SplitLine[], { locations, items }: LineContext): SplitLine | null =>
  found.find((candidate) => locations.has(candidate.location))
  ?? found.find((candidate) => items.has(candidate.item))
  ?? found[0]
  ?? null;

export { pickCandidate };
