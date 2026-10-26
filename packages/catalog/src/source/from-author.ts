/* @layer core @kind logic */
import type { Found, GithubClient } from './source.type';
import { factsIn } from './facts-in';
import { MAX_AUTHOR_REPOS } from './source.constants';

const squash = (text: string) => text.toLowerCase().replace(/[-_.\s]/g, '');

const fromAuthor = async (client: GithubClient, author: string | undefined, module: string): Promise<Found[]> => {
  if (!author) return [];
  const wanted = squash(module);
  const repos = factsIn(await client.api(`/users/${author}/repos?per_page=100&sort=pushed`));
  return repos
    .filter((facts) => squash(`${facts.repo} ${facts.description ?? ''}`).includes(wanted))
    .slice(0, MAX_AUTHOR_REPOS)
    .map((facts) => ({ facts, origins: ['author' as const] }));
};

export { fromAuthor };
