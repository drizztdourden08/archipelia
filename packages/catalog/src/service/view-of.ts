/* @layer core @kind logic */
import type { CatalogEntry } from '@archipelia/model';
import type { CatalogView, Latest } from './catalog-service.type';

const viewOf = (latest: Latest, entries: CatalogEntry[]): CatalogView => ({
  apVersion: latest.apVersion,
  entries,
  problems: latest.problems.length,
  fetchedAt: latest.fetchedAt,
  ...(latest.limited ? { limited: latest.limited } : {}),
  ...(latest.ready.total > latest.ready.fetched ? { ready: { total: latest.ready.total, shown: latest.ready.fetched } } : {}),
});

export { viewOf };
