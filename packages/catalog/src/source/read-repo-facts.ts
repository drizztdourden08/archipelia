/* @layer core @kind logic */
import type { SourceRef } from '@archipelia/model';
import { repoFactsOf } from './repo-facts-of';
import type { GithubClient, RepoFacts } from './source.type';

const readRepoFacts = async (client: GithubClient, { owner, repo }: Pick<SourceRef, 'owner' | 'repo'>): Promise<RepoFacts> => {
  const facts = repoFactsOf(await client.api(`/repos/${owner}/${repo}`));
  if (!facts) throw new Error(`GitHub has no repository ${owner}/${repo}.`);
  return facts;
};

export { readRepoFacts };
