/* @layer core @kind logic */
import { BLOCK_MS } from './source.constants';

const limitOf = (res: Response, now: number): number | undefined => {
  const slowed = res.status === 429 || (res.status === 403 && (res.headers.get('x-ratelimit-remaining') === '0' || res.headers.has('retry-after')));
  if (!slowed) return undefined;
  const reset = Number(res.headers.get('x-ratelimit-reset')) * 1000;
  const wait = Number(res.headers.get('retry-after')) * 1000;
  if (reset > now) return reset;
  return now + (wait > 0 ? wait : BLOCK_MS);
};

export { limitOf };
