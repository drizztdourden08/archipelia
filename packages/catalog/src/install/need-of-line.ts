/* @layer core @kind logic */
import { normalizePackageName } from '@archipelia/engine';
import type { PackageNeed } from '@archipelia/model';
import { EGG, HOST_HOME, REPO_PATH, URL_REQUIREMENT } from './need-of-line.constants';

const lastSegment = (address: string): string | undefined => {
  const segments = address.replace(/[#?].*$/, '').split('/').filter(Boolean);
  return segments.length < 2 ? undefined : segments.at(-1)?.replace(/@.*$/, '').replace(/\.git$/, '');
};

const githubRepo = (address: string): { owner: string; repo: string } | undefined => {
  if (!HOST_HOME.test(address)) return undefined;
  const match = REPO_PATH.exec(address.replace(HOST_HOME, ''));
  const [owner, repo] = [match?.[1], match?.[2]];
  return owner && repo ? { owner, repo } : undefined;
};

const needOfLine = (line: string): PackageNeed | undefined => {
  const found = URL_REQUIREMENT.exec(line);
  const address = found?.[2];
  if (!address) return undefined;
  const repo = githubRepo(address);
  const name = [found[1],EGG.exec(line)?.[1], repo?.repo, lastSegment(address)].find(Boolean);
  if (!name) return undefined;
  return { name: normalizePackageName(name), ...(repo ? { githubUrl: `https://github.com/${repo.owner}/${repo.repo}` } : {}) };
};

export { needOfLine };
