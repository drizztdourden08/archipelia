/* @layer core @kind logic */
import type { CatalogEntry } from '@archipelia/model';

const withPrerelease = (entry: CatalogEntry, tag: string | undefined): CatalogEntry =>
  (tag === undefined || !entry.firstParty ? entry : { ...entry, firstParty: { ...entry.firstParty, tag, prerelease: true } });

export { withPrerelease };
