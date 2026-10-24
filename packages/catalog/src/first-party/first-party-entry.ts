/* @layer core @kind logic */
import type { CatalogEntry } from '@archipelia/model';
import type { RegistryGame } from '@archipelia/trust';
import { NO_RELEASE } from './first-party.constants';
import type { ReleaseState } from './first-party.type';
import { releaseUrl } from './release-url';

const unavailableOf = (state: ReleaseState) => {
  if (state.kind === 'none') return NO_RELEASE;
  return state.kind === 'failed' ? `The release could not be read: ${state.message}` : undefined;
};

const firstPartyEntry = (game: RegistryGame, state: ReleaseState): CatalogEntry => {
  const { release } = game;
  const manifest = state.kind === 'found' ? state.manifest : undefined;
  const unavailable = unavailableOf(state);
  return {
    apworld: game.module,
    game: game.game,
    displayName: game.displayName,
    home: game.home,
    tags: game.tags,
    source: 'first-party',
    stability: 'unknown',
    versions: manifest
      ? [{ version: manifest.worldVersion, url: releaseUrl(release.repo, release.world), sha256: manifest.sha256 }]
      : [],
    firstParty: {
      client: game.client,
      bundleUrl: releaseUrl(release.repo, release.bundle),
      ...(manifest ? { minimumAp: manifest.minimumAp } : {}),
      ...(manifest?.maximumAp ? { maximumAp: manifest.maximumAp } : {}),
    },
    ...(unavailable ? { unavailable } : {}),
  };
};

export { firstPartyEntry };
