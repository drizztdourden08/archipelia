/* @layer renderer-app @kind logic */
import type { CatalogEntry } from '@archipelia/model';

const worldVersionOf = ({ firstParty, versions }: CatalogEntry): string | undefined => firstParty?.worldVersion ?? versions[0]?.version;

export { worldVersionOf };
