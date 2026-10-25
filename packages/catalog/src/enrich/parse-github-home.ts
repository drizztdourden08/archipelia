/* @layer core @kind logic */
import type { GithubRepo } from './enrich.type';
import { GITHUB_HOSTS } from './enrich.constants';
import { OWNER, REPO } from './parse-github-home.constants';

const repoOf = (pathname: string): GithubRepo | undefined => {
  const [owner, name] = pathname.split('/').filter(Boolean);
  const repo = name?.replace(/\.git$/, '');
  if (!owner || !repo || !OWNER.test(owner) || !REPO.test(repo)) return undefined;
  return repo === '.' || repo === '..' ? undefined : { owner, repo };
};

const parseGithubHome = (home: string | undefined): GithubRepo | undefined => {
  const url = URL.canParse(home ?? '') ? new URL(home ?? '') : undefined;
  return url?.protocol === 'https:' && GITHUB_HOSTS.includes(url.hostname) ? repoOf(url.pathname) : undefined;
};

export { parseGithubHome };
