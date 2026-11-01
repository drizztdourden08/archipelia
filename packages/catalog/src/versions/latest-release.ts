/* @layer core @kind logic */
import type { CatalogEntry, InstalledRelease } from '@archipelia/model';
import { defaultRelease } from '../first-party/default-release';
import type { ReleaseListDeps } from './list-release-versions.type';

const latestRelease = async ({ readReleases }: ReleaseListDeps, entry: CatalogEntry, legacy?: string): Promise<InstalledRelease | undefined> => {
  const repo = entry.firstParty?.repo;
  if (!repo) return undefined;
  const chosen = await readReleases(repo).then(({ releases }) => defaultRelease(releases, legacy), () => undefined);
  return chosen && { tag: chosen.tag, prerelease: chosen.prerelease };
};

export { latestRelease };
