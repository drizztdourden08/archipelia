/* @layer core @kind logic */
import type { RegistryGame } from '@archipelia/trust';
import type { ReleaseState } from './first-party.type';
import { isReleaseManifest } from './is-release-manifest';
import { readReleaseAsset } from './read-release-asset';
import { releaseUrl } from './release-url';

const readReleaseState = async ({ release }: RegistryGame, request: typeof fetch): Promise<ReleaseState> => {
  const url = releaseUrl(release.repo, release.manifest);
  try {
    const manifest = await readReleaseAsset(url, request);
    if (manifest === null) return { kind: 'none' };
    if (!isReleaseManifest(manifest)) return { kind: 'failed', message: `${url}: not a release manifest` };
    return { kind: 'found', manifest };
  } catch (err) {
    return { kind: 'failed', message: err instanceof Error ? err.message : String(err) };
  }
};

export { readReleaseState };
