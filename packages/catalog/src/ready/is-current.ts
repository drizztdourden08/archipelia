/* @layer core @kind logic */
import { FORCE_GAP_MS, READY_REFRESH_MS } from './ready.constants';

const isCurrent = (fetchedAt: number, now: number, force: boolean): boolean =>
  now - fetchedAt < (force ? FORCE_GAP_MS : READY_REFRESH_MS);

export { isCurrent };
