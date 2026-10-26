/* @layer core @kind logic */
import type { GithubRepo } from './enrich.type';
import { GITHUB_WEB, SCHEME } from './enrich.constants';

const absoluteLink = (target: string, { owner, repo }: GithubRepo): string => {
  if (SCHEME.test(target) || target.startsWith('#')) return target;
  if (target.startsWith('//')) return `https:${target}`;
  const home = `${GITHUB_WEB}/${owner}/${repo}`;
  const base = `${home}/blob/HEAD/`;
  const path = target.replace(/^\/+/, '');
  const resolved = URL.canParse(path, base) ? new URL(path, base).href : home;
  return resolved.startsWith(base) ? resolved : home;
};

export { absoluteLink };
