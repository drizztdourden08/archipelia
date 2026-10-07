/* @layer core @kind logic */
import type { RetryPlan } from './live-room.type';
import { RECONNECT_DELAYS_MS } from './reconnect.constants';

const nextRetry = (tried: number, now: number, delays: readonly number[] = RECONNECT_DELAYS_MS): RetryPlan | null => {
  const wait = delays[tried];
  if (wait === undefined) return null;
  return { attempt: tried + 1, attempts: delays.length, retryAt: now + wait };
};

export { nextRetry };
