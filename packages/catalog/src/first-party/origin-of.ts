/* @layer core @kind logic */
import type { CatalogEntry, WorldOrigin } from '@archipelia/model';

const originOf = ({ discovered }: CatalogEntry): { origin?: WorldOrigin } =>
  (discovered ? { origin: { repoId: discovered.repoId, repo: discovered.repo } } : {});

export { originOf };
