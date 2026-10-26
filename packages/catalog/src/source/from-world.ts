/* @layer core @kind logic */
import type { GithubRepo } from '../enrich/enrich.type';
import { foundFrom } from './found-from';
import type { Found, GithubClient } from './source.type';

const fromWorld = async (client: GithubClient, links: readonly GithubRepo[]): Promise<Found[]> =>
  (await Promise.all(links.map(({ owner, repo }) => foundFrom(client, owner, repo, 'world')))).flat();

export { fromWorld };
