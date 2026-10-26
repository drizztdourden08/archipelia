/* @layer core @kind logic */
import type { CatalogEntry } from '@archipelia/model';

const withListedGuides = (entries: CatalogEntry[], listed: CatalogEntry[]): CatalogEntry[] => {
  const named = new Map(listed.filter((e) => e.source === 'official').map((e) => [e.apworld, e]));
  return entries.map((entry) => {
    const found = named.get(entry.apworld);
    return found ? { ...entry, displayName: found.displayName, home: found.home, setupGuide: found.setupGuide, tags: found.tags } : entry;
  });
};

export { withListedGuides };
