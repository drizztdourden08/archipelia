/* @layer core @kind logic */
import type { GithubRepo, ReleaseFiles } from './enrich.type';
import { fetchReleaseArt } from './fetch-release-art';
import { fetchReleaseDescription } from './fetch-release-description';

const readReleaseFiles = async (fetchFn: typeof fetch, repo: GithubRepo, tag?: string): Promise<ReleaseFiles> => {
  const [markdown, art] = await Promise.all([
    fetchReleaseDescription(fetchFn, repo, tag).catch(() => undefined),
    fetchReleaseArt(fetchFn, repo, tag).catch(() => undefined),
  ]);
  return { ...(markdown ? { markdown } : {}), ...(art ? { art } : {}) };
};

export { readReleaseFiles };
