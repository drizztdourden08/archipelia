/* @layer core @kind logic */
import type { GithubRepo } from '../enrich/enrich.type';
import { parseGithubHome } from '../enrich/parse-github-home';
import { LINK_IN_TEXT, RESERVED_OWNERS, TRAILING_PUNCTUATION } from './source.constants';

const githubReposIn = (text: string): GithubRepo[] => {
  const seen = new Set<string>();
  const found: GithubRepo[] = [];
  for (const match of text.matchAll(LINK_IN_TEXT)) {
    const repo = parseGithubHome(match[0].replace(TRAILING_PUNCTUATION, ''));
    const key = repo ? `${repo.owner}/${repo.repo}`.toLowerCase() : '';
    if (!repo || RESERVED_OWNERS.has(repo.owner.toLowerCase()) || seen.has(key)) continue;
    seen.add(key);
    found.push(repo);
  }
  return found;
};

export { githubReposIn };
