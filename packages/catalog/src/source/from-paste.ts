/* @layer core @kind logic */
import { foundFrom } from './found-from';
import { repoOfText } from './repo-of-text';
import type { Found, GithubClient } from './source.type';

const fromPaste = async (client: GithubClient, paste: string | undefined): Promise<Found[]> => {
  const repo = paste === undefined ? undefined : repoOfText(paste);
  return repo ? foundFrom(client, repo.owner, repo.repo, 'pasted') : [];
};

export { fromPaste };
