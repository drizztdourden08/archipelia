/* @layer core @kind logic */
import { GithubLimitError } from './github-limit-error';
import type { Attempt, Found } from './source.type';

const attemptSources = async (work: () => Promise<Found[]>): Promise<Attempt> => {
  try {
    return { found: await work() };
  } catch (err) {
    return err instanceof GithubLimitError ? { found: [], limitedUntil: err.resetAt } : { found: [], error: err };
  }
};

export { attemptSources };
