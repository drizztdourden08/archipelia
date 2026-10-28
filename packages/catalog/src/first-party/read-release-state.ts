/* @layer core @kind logic */
import type { RegistryGame } from '@archipelia/trust';
import { MAX_MANIFEST_BYTES, STANDARD_MANIFEST } from './first-party.constants';
import type { ReleaseState } from './first-party.type';
import type { Classify } from './read-release-state.type';
import { isBuildsManifest } from './is-builds-manifest';
import { isReleaseManifest } from './is-release-manifest';
import { readReleaseAsset } from './read-release-asset';
import { releaseUrl } from './release-url';
import { standardState } from './standard-state';

const legacyState = (game: RegistryGame): Classify => (manifest) => {
  if (game.release.kind === 'builds' && isBuildsManifest(manifest)) return { kind: 'builds', manifest };
  if (game.release.kind !== 'builds' && isReleaseManifest(manifest)) return { kind: 'found', manifest };
  throw new Error('not a release manifest');
};

const readState = async (url: string, request: typeof fetch, classify: Classify): Promise<ReleaseState> => {
  try {
    const manifest = await readReleaseAsset(url, request, MAX_MANIFEST_BYTES);
    return manifest === null ? { kind: 'none' } : classify(manifest);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { kind: 'failed', message: message.startsWith(url) ? message : `${url}: ${message}` };
  }
};

const isUsable = (state: ReleaseState): boolean => state.kind === 'found' || state.kind === 'builds';

const readReleaseState = async (game: RegistryGame, request: typeof fetch): Promise<ReleaseState> => {
  const { repo, manifest } = game.release;
  const standard = await readState(releaseUrl(repo, STANDARD_MANIFEST), request, (value) => standardState(game, value));
  if (isUsable(standard)) return standard;
  const legacy = await readState(releaseUrl(repo, manifest), request, legacyState(game));
  return standard.kind === 'failed' && legacy.kind === 'none' ? standard : legacy;
};

export { readReleaseState };
