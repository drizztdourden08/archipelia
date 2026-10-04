/* @layer renderer-app @kind logic */
import { nextRetry } from '@archipelia/sessions/live-room';
import type { RetryPlan } from '@archipelia/sessions/live-room';

const createRetryTimer = () => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  const stop = () => {
    if (timer !== null) clearTimeout(timer);
    timer = null;
  };
  const plan = (tried: number, run: () => void): RetryPlan | null => {
    stop();
    const next = nextRetry(tried, Date.now());
    if (next) timer = setTimeout(run, next.retryAt - Date.now());
    return next;
  };
  return { plan, stop };
};

export { createRetryTimer };
