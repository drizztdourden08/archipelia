/* @layer renderer-app @kind logic */
import type { GameRow } from '../GameStore.type';

const rankOf = ({ entry, state }: GameRow) => {
  const found = state === 'available' ? entry.discovered : undefined;
  return found ? { tier: 1, stars: found.stars, pushedAt: found.pushedAt } : { tier: 0, stars: 0, pushedAt: '' };
};

const rankRows = (a: GameRow, b: GameRow): number => {
  const [first, second] = [rankOf(a), rankOf(b)];
  return first.tier - second.tier
    || second.stars - first.stars
    || second.pushedAt.localeCompare(first.pushedAt)
    || a.entry.displayName.localeCompare(b.entry.displayName);
};

export { rankRows };
