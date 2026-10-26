/* @layer core @kind logic */
import type { SourceSuggestions } from '@archipelia/model';
import { createLimiter } from '../enrich/create-limiter';
import { attemptSources } from './attempt-sources';
import { candidateOf } from './candidate-of';
import { fromAuthor } from './from-author';
import { fromPaste } from './from-paste';
import { fromSearch } from './from-search';
import { fromWorld } from './from-world';
import { mergeFound } from './merge-found';
import { moduleInRepo } from './module-in-repo';
import { rankCandidates } from './rank-candidates';
import { CHECK_PARALLEL, MAX_CHECKED, MAX_SHOWN } from './source.constants';
import type { SuggestDeps, Wanted } from './source.type';

const suggestSources = async ({ client, now }: SuggestDeps, { module, world, paste }: Wanted): Promise<SourceSuggestions> => {
  const attempts = await Promise.all([
    attemptSources(() => fromPaste(client, paste)),
    attemptSources(() => fromWorld(client, world.links)),
    attemptSources(() => fromAuthor(client, world.author, module)),
    attemptSources(() => fromSearch(client, module)),
  ]);
  const merged = mergeFound(attempts.flatMap((attempt) => attempt.found)).slice(0, MAX_CHECKED);
  const limitedUntil = attempts.find((attempt) => attempt.limitedUntil !== undefined)?.limitedUntil;
  const failure = attempts.find((attempt) => attempt.error !== undefined)?.error;
  if (merged.length === 0 && limitedUntil === undefined && failure !== undefined) throw failure instanceof Error ? failure : new Error(String(failure));
  const check = createLimiter(CHECK_PARALLEL);
  const checked = await Promise.all(merged.map((found) => check(async () => {
    const contains = await moduleInRepo(client, found.facts, module).catch(() => false);
    return candidateOf(found, contains, now());
  })));
  const namedId = world.named && `${world.named.owner}/${world.named.repo}`.toLowerCase();
  const shown = checked.filter(({ contains, origins, id }) => contains || origins.includes('pasted') || id.toLowerCase() === namedId);
  return {
    module,
    candidates: rankCandidates(shown, module).slice(0, MAX_SHOWN),
    limitedUntil,
    pasteFailed: paste !== undefined && !merged.some(({ origins }) => origins.includes('pasted')),
  };
};

export { suggestSources };
