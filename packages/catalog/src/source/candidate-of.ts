/* @layer core @kind logic */
import type { SourceCandidate } from '@archipelia/model';
import { warningsOf } from './warnings-of';
import type { Found } from './source.type';

const candidateOf = ({ facts, origins }: Found, contains: boolean, now: number): SourceCandidate => ({
  id: `${facts.owner}/${facts.repo}`,
  owner: facts.owner,
  repo: facts.repo,
  url: `https://github.com/${facts.owner}/${facts.repo}`,
  description: facts.description,
  stars: facts.stars,
  pushedAt: facts.pushedAt,
  createdAt: facts.createdAt,
  archived: facts.archived,
  fork: facts.fork,
  origins,
  contains,
  warnings: warningsOf(facts, now),
});

export { candidateOf };
