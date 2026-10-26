/* @layer core @kind logic */
import { repoFactsOf } from './repo-facts-of';
import type { RepoFacts } from './source.type';

const factsIn = (list: unknown): RepoFacts[] =>
  (Array.isArray(list) ? list : []).flatMap((item: unknown) => {
    const facts = repoFactsOf(item);
    return facts ? [facts] : [];
  });

export { factsIn };
