/* @layer core @kind logic */
import type { RegistryGame } from '@archipelia/trust';
import { isBuildsManifest } from './is-builds-manifest';
import { isReleaseManifest } from './is-release-manifest';
import type { Classify } from './read-release-state.type';

const legacyState = (game: RegistryGame): Classify => (manifest) => {
  if (game.release.kind === 'builds' && isBuildsManifest(manifest)) return { kind: 'builds', manifest };
  if (game.release.kind !== 'builds' && isReleaseManifest(manifest)) return { kind: 'found', manifest };
  throw new Error('not a release manifest');
};

export { legacyState };
