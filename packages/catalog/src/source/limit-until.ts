/* @layer core @kind logic */
import { BLOCK_MS } from './source.constants';
import { limitOf } from './limit-of';

const limitUntil = (res: Response, now: number): number | undefined => {
  if (res.status !== 403 && res.status !== 429) return undefined;
  return limitOf(res, now) ?? now + BLOCK_MS;
};

export { limitUntil };
