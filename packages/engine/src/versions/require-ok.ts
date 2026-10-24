/* @layer core @kind logic */
import { FeedError } from './feed-error';
import type { FetchedResponse } from './fetch-like.type';

const requireOk = (res: FetchedResponse, what: string): void => {
  if (res.ok) return;
  const exhausted = res.status === 429 || (res.status === 403 && res.headers.get('x-ratelimit-remaining') === '0');
  if (!exhausted) throw new FeedError('http', `${what}: HTTP ${res.status}`);
  const reset = Number(res.headers.get('x-ratelimit-reset'));
  throw new FeedError('rate-limited', `${what}: rate limited`, Number.isFinite(reset) && reset > 0 ? reset * 1000 : undefined);
};

export { requireOk };
