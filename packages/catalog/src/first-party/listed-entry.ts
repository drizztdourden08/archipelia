/* @layer core @kind logic */
import type { CatalogEntry, FirstPartyRelease } from '@archipelia/model';
import { NO_RELEASE } from './first-party.constants';
import type { ReleaseState } from './first-party.type';
import type { Listing } from './listing.type';
import { releaseUrl } from './release-url';

const unavailableOf = (state: ReleaseState) => {
  if (state.kind === 'none') return NO_RELEASE;
  return state.kind === 'failed' ? `The release could not be read: ${state.message}` : undefined;
};

const namesOf = (listing: Listing, state: ReleaseState) =>
  (state.kind === 'found' ? state.names : undefined) ?? { world: listing.world, bundle: listing.bundle };

const releaseOf = (listing: Listing, state: ReleaseState, tag?: string): FirstPartyRelease => {
  const { repo, client } = listing;
  const base = { ...(client ? { client } : {}), repo, bundleUrl: releaseUrl(repo, namesOf(listing, state).bundle, tag) };
  if (state.kind === 'found') {
    const { minimumAp, maximumAp, appVersion } = state.manifest;
    return { ...base, minimumAp, ...(maximumAp ? { maximumAp } : {}), ...(appVersion ? { appVersion } : {}) };
  }
  if (state.kind !== 'builds') return base;
  const { minimumAp, maximumAp, worldVersion, appVersion, builds } = state.manifest;
  return {
    ...base,
    worldVersion,
    ...(appVersion ? { appVersion } : {}),
    ...(minimumAp ? { minimumAp } : {}),
    ...(maximumAp ? { maximumAp } : {}),
    builds: builds.map((build) => ({
      archipelagoVersion: build.archipelagoVersion,
      url: releaseUrl(repo, build.file, tag),
      bundleUrl: releaseUrl(repo, build.bundle, tag),
      sha256: build.sha256,
      size: build.size,
    })),
  };
};

const listedEntry = (listing: Listing, state: ReleaseState, tag?: string): CatalogEntry => {
  const unavailable = unavailableOf(state);
  return {
    apworld: listing.module,
    game: listing.game,
    displayName: listing.displayName,
    home: listing.home,
    tags: listing.tags,
    source: 'first-party',
    stability: 'unknown',
    versions: state.kind === 'found'
      ? [{
        version: state.manifest.worldVersion,
        url: releaseUrl(listing.repo, namesOf(listing, state).world, tag),
        sha256: state.manifest.sha256,
        ...(state.manifest.size === undefined ? {} : { size: state.manifest.size }),
      }]
      : [],
    firstParty: releaseOf(listing, state, tag),
    ...(unavailable ? { unavailable } : {}),
  };
};

export { listedEntry };
