/* @layer core @kind logic */
import type { RegistryGame } from '@archipelia/trust';
import type { ReleaseState } from './first-party.type';
import { isBuildsManifest } from './is-builds-manifest';
import { isReleaseManifest } from './is-release-manifest';
import { readReleaseAsset } from './read-release-asset';
import { releaseUrl } from './release-url';

const classify = (game: RegistryGame, manifest: unknown): ReleaseState | undefined => {
  if (game.release.kind === 'builds') return isBuildsManifest(manifest) ? { kind: 'builds', manifest } : undefined;
  return isReleaseManifest(manifest) ? { kind: 'found', manifest } : undefined;
};

const readReleaseState = async (game: RegistryGame, request: typeof fetch): Promise<ReleaseState> => {
  const url = releaseUrl(game.release.repo, game.release.manifest);
  try {
    const manifest = await readReleaseAsset(url, request);
    if (manifest === null) return { kind: 'none' };
    return classify(game, manifest) ?? { kind: 'failed', message: `${url}: not a release manifest` };
  } catch (err) {
    return { kind: 'failed', message: err instanceof Error ? err.message : String(err) };
  }
};

export { readReleaseState };
