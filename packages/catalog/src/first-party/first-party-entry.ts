/* @layer core @kind logic */
import type { CatalogEntry, FirstPartyRelease } from '@archipelia/model';
import type { RegistryGame } from '@archipelia/trust';
import { NO_RELEASE } from './first-party.constants';
import type { ReleaseState } from './first-party.type';
import { releaseUrl } from './release-url';

const unavailableOf = (state: ReleaseState) => {
  if (state.kind === 'none') return NO_RELEASE;
  return state.kind === 'failed' ? `The release could not be read: ${state.message}` : undefined;
};

const namesOf = ({ release }: RegistryGame, state: ReleaseState) =>
  (state.kind === 'found' ? state.names : undefined) ?? { world: release.world, bundle: release.bundle };

const releaseOf = (game: RegistryGame, state: ReleaseState): FirstPartyRelease => {
  const { release } = game;
  const base = { client: game.client, repo: release.repo, bundleUrl: releaseUrl(release.repo, namesOf(game, state).bundle) };
  if (state.kind === 'found') {
    const { minimumAp, maximumAp } = state.manifest;
    return { ...base, minimumAp, ...(maximumAp ? { maximumAp } : {}) };
  }
  if (state.kind !== 'builds') return base;
  const { minimumAp, maximumAp, worldVersion, builds } = state.manifest;
  return {
    ...base,
    worldVersion,
    ...(minimumAp ? { minimumAp } : {}),
    ...(maximumAp ? { maximumAp } : {}),
    builds: builds.map((build) => ({
      archipelagoVersion: build.archipelagoVersion,
      url: releaseUrl(release.repo, build.file),
      bundleUrl: releaseUrl(release.repo, build.bundle),
      sha256: build.sha256,
      size: build.size,
    })),
  };
};

const firstPartyEntry = (game: RegistryGame, state: ReleaseState): CatalogEntry => {
  const unavailable = unavailableOf(state);
  return {
    apworld: game.module,
    game: game.game,
    displayName: game.displayName,
    home: game.home,
    tags: game.tags,
    source: 'first-party',
    stability: 'unknown',
    versions: state.kind === 'found'
      ? [{
        version: state.manifest.worldVersion,
        url: releaseUrl(game.release.repo, namesOf(game, state).world),
        sha256: state.manifest.sha256,
        ...(state.manifest.size === undefined ? {} : { size: state.manifest.size }),
      }]
      : [],
    firstParty: releaseOf(game, state),
    ...(unavailable ? { unavailable } : {}),
  };
};

export { firstPartyEntry };
