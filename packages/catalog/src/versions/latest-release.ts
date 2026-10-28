/* @layer core @kind logic */
import type { CatalogEntry, InstalledRelease } from '@archipelia/model';
import type { ReleaseListDeps } from './list-release-versions.type';

const latestRelease = async ({ readReleases }: ReleaseListDeps, entry: CatalogEntry): Promise<InstalledRelease | undefined> => {
  const repo = entry.firstParty?.repo;
  if (!repo) return undefined;
  const stable = await readReleases(repo).then(({ releases }) => releases.find((release) => !release.prerelease), () => undefined);
  return stable && { tag: stable.tag, prerelease: false };
};

export { latestRelease };
