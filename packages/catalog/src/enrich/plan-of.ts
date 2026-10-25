/* @layer core @kind logic */
import { basename } from 'node:path';
import type { EnrichDeps, EnrichPlan, EnrichRequest } from './enrich.type';
import { parseGithubHome } from './parse-github-home';

const planOf = async ({ entryOf, engineDir }: Pick<EnrichDeps, 'entryOf' | 'engineDir'>, request: EnrichRequest): Promise<EnrichPlan | undefined> => {
  const entry = await entryOf(request);
  if (!entry) return undefined;
  if (request.source === 'official') return { entry, stamp: `engine:${basename(await engineDir())}` };
  const repo = parseGithubHome(entry.home);
  return repo ? { entry, repo, stamp: `home:${repo.owner}/${repo.repo}` } : undefined;
};

export { planOf };
