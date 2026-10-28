/* @layer core @kind logic */
import { buildVersionsOf } from './build-versions-of';
import { checkRelease } from './check-release';
import { choicesOf } from './choices-of';
import type { ReleaseListDeps } from './list-release-versions.type';
import { manifestAssetOf } from './manifest-asset-of';
import { manifestKey } from './manifest-key';
import { readReleaseManifests } from './read-release-manifests';
import { registryGameOf } from './registry-game-of';
import { MAX_CHECKED_RELEASES, NO_PROBLEM } from './versions.constants';
import type { ManifestWant, VersionList, VersionsParams } from './versions.type';

const listReleaseVersions = async ({ files, request, readReleases }: ReleaseListDeps, { entry, registry, ap }: VersionsParams): Promise<VersionList> => {
  const repo = entry.firstParty?.repo;
  if (!repo) return { by: 'tag', choices: [] };
  try {
    const { releases, limitedUntil } = await readReleases(repo);
    const game = registryGameOf(registry, entry);
    const plans = releases.map((release, at) => ({
      release, asset: manifestAssetOf(release, game), builds: buildVersionsOf(entry.apworld, release), checked: at < MAX_CHECKED_RELEASES,
    }));
    const wants = plans.flatMap(({ release, asset, builds, checked }): ManifestWant[] => (asset && builds.length === 0 && checked ? [{ release, asset }] : []));
    const reads = await readReleaseManifests({ files, request, repo, wants });
    const checks = plans.map((plan) => checkRelease({
      ...plan, entry, game, ap, manifest: plan.asset ? reads.get(manifestKey(repo, { release: plan.release, asset: plan.asset })) : undefined,
    }));
    return choicesOf(entry, releases, checks, limitedUntil);
  } catch (error) {
    return { by: 'tag', choices: [], problem: error instanceof Error ? error.message : NO_PROBLEM };
  }
};

export { listReleaseVersions };
