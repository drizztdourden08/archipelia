/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import { factsIn } from './facts-in';
import { MIN_SEARCH_HITS } from './source.constants';
import type { Found, GithubClient, RepoFacts } from './source.type';

const searchFor = async (client: GithubClient, module: string, scope: string): Promise<RepoFacts[]> => {
  const body = await client.api(`/search/repositories?q=${encodeURIComponent(`${module} in:${scope}`)}&per_page=10`);
  return factsIn(isRecord(body) ? body.items : undefined);
};

const fromSearch = async (client: GithubClient, module: string): Promise<Found[]> => {
  const byName = await searchFor(client, module, 'name');
  const more = byName.length >= MIN_SEARCH_HITS ? [] : await searchFor(client, module, 'name,description');
  return [...byName, ...more].map((facts) => ({ facts, origins: ['search' as const] }));
};

export { fromSearch };
