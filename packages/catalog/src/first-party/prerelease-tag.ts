/* @layer core @kind logic */
import type { ReleasesRead } from '../versions/versions.type';
import { defaultRelease } from './default-release';

const prereleaseTag = async (readReleases: (repo: string) => Promise<ReleasesRead>, repo: string): Promise<string | undefined> => {
  const { releases } = await readReleases(repo);
  const chosen = defaultRelease(releases);
  return chosen?.prerelease ? chosen.tag : undefined;
};

export { prereleaseTag };
