/* @layer core @kind logic */
import type { CatalogEntry } from '@archipelia/model';
import type { RegistryGame } from '@archipelia/trust';
import type { ReleaseState } from './first-party.type';
import { listedEntry } from './listed-entry';

const firstPartyEntry = ({ release, ...game }: RegistryGame, state: ReleaseState, tag?: string): CatalogEntry =>
  listedEntry({
    module: game.module, game: game.game, displayName: game.displayName, home: game.home, tags: game.tags,
    repo: release.repo, client: game.client, world: release.world, bundle: release.bundle,
  }, state, tag);

export { firstPartyEntry };
