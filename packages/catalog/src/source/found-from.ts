/* @layer core @kind logic */
import type { SourceOrigin } from '@archipelia/model';
import type { Found, GithubClient } from './source.type';
import { repoFactsOf } from './repo-facts-of';

const foundFrom = async (client: GithubClient, owner: string, repo: string, origin: SourceOrigin): Promise<Found[]> => {
  const facts = repoFactsOf(await client.api(`/repos/${owner}/${repo}`));
  return facts ? [{ facts, origins: [origin] }] : [];
};

export { foundFrom };
