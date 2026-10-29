/* @layer core @kind logic */
import { basename } from 'node:path';
import type { EnrichDeps, EnrichPlan, EnrichRequest } from './enrich.type';
import { parseGithubHome } from './parse-github-home';

const planOf = async ({ entryOf, engineDir }: Pick<EnrichDeps, 'entryOf' | 'engineDir'>, request: EnrichRequest): Promise<EnrichPlan | undefined> => {
  const entry = await entryOf(request);
  if (!entry) return undefined;
  if (request.source === 'official') return { entry, stamp: `engine:${basename(await engineDir())}` };
  const { release, releaseTag } = entry;
  if (release) {
    const stamp = `release:${release.owner}/${release.repo}@${entry.releaseVersion ?? ''}${releaseTag ? `#${releaseTag}` : ''}`;
    return { entry, repo: parseGithubHome(entry.home) ?? release, release, ...(releaseTag ? { tag: releaseTag } : {}), stamp };
  }
  const repo = parseGithubHome(entry.home);
  return repo ? { entry, repo, stamp: `home:${repo.owner}/${repo.repo}` } : undefined;
};

export { planOf };
