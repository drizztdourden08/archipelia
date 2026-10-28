/* @layer core @kind logic */
import type { CatalogEntry } from '@archipelia/model';
import type { Registry, RegistryGame } from '@archipelia/trust';
import { sameName } from '../ready/same-name';

const registryGameOf = (registry: Registry, { apworld, discovered, firstParty }: CatalogEntry): RegistryGame | undefined =>
  (discovered ? undefined : registry.games.find((game) => sameName(game.module, apworld) && sameName(game.release.repo, firstParty?.repo ?? '')));

export { registryGameOf };
