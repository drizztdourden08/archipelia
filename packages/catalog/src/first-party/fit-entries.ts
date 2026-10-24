/* @layer core @kind logic */
import type { CatalogEntry } from '@archipelia/model';
import { engineFit } from './engine-fit';

const fitEntries = (entries: CatalogEntry[], apVersion: string | undefined): CatalogEntry[] =>
  entries.map((entry) => {
    if (!entry.firstParty || apVersion === undefined || entry.unavailable) return entry;
    const unavailable = engineFit(entry.firstParty, apVersion);
    return unavailable ? { ...entry, unavailable } : entry;
  });

export { fitEntries };
