/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import type { RegistryGame } from '@archipelia/trust';
import { MAX_MANIFEST_BYTES, STANDARD_MANIFEST } from '../first-party/first-party.constants';
import type { ReleaseState } from '../first-party/first-party.type';
import { readReleaseAsset } from '../first-party/read-release-asset';
import { readReleaseState } from '../first-party/read-release-state';
import { releaseUrl } from '../first-party/release-url';
import { stateOfManifest } from '../ready/state-of-manifest';

const readTagState = async (request: typeof fetch, repo: string, game: RegistryGame | undefined, tag: string): Promise<ReleaseState> => {
  if (game) return readReleaseState(game, request, tag);
  try {
    const manifest = await readReleaseAsset(releaseUrl(repo, STANDARD_MANIFEST, tag), request, MAX_MANIFEST_BYTES);
    return stateOfManifest(isRecord(manifest) ? manifest : null);
  } catch (error) {
    return { kind: 'failed', message: error instanceof Error ? error.message : String(error) };
  }
};

export { readTagState };
