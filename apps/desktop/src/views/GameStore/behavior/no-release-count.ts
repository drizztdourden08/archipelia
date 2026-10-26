/* @layer renderer-app @kind logic */
import type { CatalogEntry } from '@archipelia/model';

const noReleaseCount = (entries: readonly CatalogEntry[] | undefined): number =>
  (entries ?? []).filter((entry) => entry.source === 'index' && entry.versions.length === 0).length;

export { noReleaseCount };
