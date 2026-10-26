/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import { OWNER, REPO } from '../enrich/parse-github-home.constants';
import type { RepoFacts } from './source.type';

const textOf = (value: unknown): string | undefined => (typeof value === 'string' && value !== '' ? value : undefined);

const repoFactsOf = (value: unknown): RepoFacts | undefined => {
  if (!isRecord(value) || !isRecord(value.owner)) return undefined;
  const [owner, repo] = [value.owner.login, value.name];
  if (typeof owner !== 'string' || typeof repo !== 'string' || !OWNER.test(owner) || !REPO.test(repo)) return undefined;
  return {
    owner,
    repo,
    description: textOf(value.description),
    stars: typeof value.stargazers_count === 'number' ? value.stargazers_count : 0,
    pushedAt: textOf(value.pushed_at),
    createdAt: textOf(value.created_at),
    archived: value.archived === true,
    fork: value.fork === true,
    branch: textOf(value.default_branch),
  };
};

export { repoFactsOf };
