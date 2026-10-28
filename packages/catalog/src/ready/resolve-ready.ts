/* @layer core @kind logic */
import type { CatalogEntry } from '@archipelia/model';
import type { Registry } from '@archipelia/trust';
import { parseGithubHome } from '../enrich/parse-github-home';
import { withCommunityGuides } from '../first-party/with-community-guides';
import { candidateOrder } from './candidate-order';
import { isBlocked } from './is-blocked';
import { isImpostor } from './is-impostor';
import { isListed } from './is-listed';
import { sameName } from './same-name';
import type { Candidate, Resolved } from './resolve-ready.type';

const homeIs = (entry: CatalogEntry, fullName: string): boolean => {
  const home = parseGithubHome(entry.home);
  return home !== undefined && sameName(`${home.owner}/${home.repo}`, fullName);
};

const claims = (a: CatalogEntry, b: CatalogEntry): boolean => sameName(a.apworld, b.apworld) || sameName(a.game, b.game);

const alsoInIndex = (entry: CatalogEntry, index: CatalogEntry): CatalogEntry => {
  const merged = withCommunityGuides(entry, index);
  return merged.discovered ? { ...merged, discovered: { ...merged.discovered, alsoInIndex: true } } : merged;
};

const resolveReady = (taken: CatalogEntry[], registry: Registry, candidates: Candidate[]): Resolved => {
  let entries = taken;
  const problems: string[] = [];
  for (const { repo, entry } of [...candidates].sort(candidateOrder)) {
    if (isBlocked(registry, repo) || isListed(registry, repo)) continue;
    if (isImpostor(registry, repo)) {
      problems.push(`Archipelia ready: ${repo.fullName} is hidden because it uses the name of a listed repository under another id.`);
      continue;
    }
    const index = entries.find((other) => other.source === 'index' && sameName(other.apworld, entry.apworld) && homeIs(other, repo.fullName));
    const clash = entries.find((other) => other !== index && claims(other, entry));
    if (clash) {
      problems.push(`Archipelia ready: ${repo.fullName} is hidden because ${entry.apworld} is already taken by ${clash.displayName}.`);
      continue;
    }
    entries = [...entries.filter((other) => other !== index), index ? alsoInIndex(entry, index) : entry];
  }
  return { entries, problems };
};

export { resolveReady };
