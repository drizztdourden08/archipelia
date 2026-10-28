/* @layer core @kind logic */
import type { CatalogEntry } from '@archipelia/model';

const withCommunityGuides = (entry: CatalogEntry, community: CatalogEntry | undefined): CatalogEntry => ({
  ...entry,
  setupGuide: entry.setupGuide ?? community?.setupGuide,
  tracker: entry.tracker ?? community?.tracker,
  tags: entry.tags.length > 0 ? entry.tags : (community?.tags ?? []),
});

export { withCommunityGuides };
