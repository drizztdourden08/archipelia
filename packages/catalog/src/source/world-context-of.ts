/* @layer core @kind logic */
import type { GithubRepo } from '../enrich/enrich.type';
import { parseGithubHome } from '../enrich/parse-github-home';
import { githubReposIn } from './github-repos-in';
import { MAX_WORLD_LINKS } from './source.constants';
import type { WorldContext, WorldTexts } from './source.type';

const sameRepo = (left: GithubRepo, right: GithubRepo) => `${left.owner}/${left.repo}`.toLowerCase() === `${right.owner}/${right.repo}`.toLowerCase();

const worldContextOf = ({ linked, home, texts }: WorldTexts): WorldContext => {
  const named = parseGithubHome(linked);
  const homeRepo = parseGithubHome(home);
  const first = [named, homeRepo].filter((repo): repo is GithubRepo => repo !== undefined);
  const inText = texts.flatMap((text) => (text ? githubReposIn(text) : []));
  const links = [...first, ...inText].filter((repo, at, all) => all.findIndex((other) => sameRepo(other, repo)) === at).slice(0, MAX_WORLD_LINKS);
  return { links, ...(homeRepo ? { author: homeRepo.owner } : {}), ...(named ? { named } : {}) };
};

export { worldContextOf };
