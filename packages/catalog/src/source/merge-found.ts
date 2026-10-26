/* @layer core @kind logic */
import type { Found } from './source.type';

const idOf = ({ facts }: Found) => `${facts.owner}/${facts.repo}`.toLowerCase();

const mergeFound = (list: readonly Found[]): Found[] => {
  const merged = new Map<string, Found>();
  for (const found of list) {
    const key = idOf(found);
    const known = merged.get(key);
    merged.set(key, known ? { facts: known.facts, origins: [...new Set([...known.origins, ...found.origins])] } : found);
  }
  return [...merged.values()];
};

export { mergeFound };
