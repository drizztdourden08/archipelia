/* @layer core @kind logic */
import { normalizePackageName } from '@archipelia/engine';
import type { Ranked } from './source.type';

const flag = (value: boolean) => (value ? 1 : 0);

const keysOf = (item: Ranked, module: string): number[] => [
  flag(item.contains),
  flag(item.origins.includes('world')),
  flag(item.origins.includes('author')),
  flag(normalizePackageName(item.repo) === normalizePackageName(module)),
  flag(!item.fork),
  item.stars,
  Date.parse(item.pushedAt ?? '') || 0,
];

const rankCandidates = <T extends Ranked>(items: readonly T[], module: string): T[] =>
  items
    .map((item) => ({ item, keys: keysOf(item, module) }))
    .sort((left, right) => {
      const at = left.keys.findIndex((key, index) => key !== right.keys[index]);
      return at < 0 ? 0 : (right.keys[at] ?? 0) - (left.keys[at] ?? 0);
    })
    .map(({ item }) => item);

export { rankCandidates };
