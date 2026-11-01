/* @layer core @kind logic */
import type { ReleasesRead } from '../versions/versions.type';
import { manifestRelease } from './default-release';

const prereleaseTag = async (readReleases: (repo: string) => Promise<ReleasesRead>, repo: string, legacy?: string): Promise<string | undefined> => {
  const { releases } = await readReleases(repo);
  const chosen = manifestRelease(releases, legacy);
  return chosen?.prerelease ? chosen.tag : undefined;
};

export { prereleaseTag };
