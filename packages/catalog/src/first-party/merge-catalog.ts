/* @layer core @kind logic */
import type { CatalogEntry } from '@archipelia/model';
import { withCommunityGuides } from './with-community-guides';

const mergeCatalog = (community: CatalogEntry[], firstParty: CatalogEntry[]): CatalogEntry[] => {
  const official = new Set(community.filter((entry) => entry.source === 'official').map((entry) => entry.apworld));
  const mine = firstParty.filter((entry) => !official.has(entry.apworld));
  const replaced = new Map(community.filter((entry) => entry.source !== 'official').map((entry) => [entry.apworld, entry]));
  const kept = community.filter((entry) => entry.source === 'official' || !mine.some((own) => own.apworld === entry.apworld));
  return [...kept, ...mine.map((entry) => withCommunityGuides(entry, replaced.get(entry.apworld)))];
};

export { mergeCatalog };
