/* @layer electron-main @kind logic */
import type { JoinTiming } from './joins.type';

const createRetries = (timing: Pick<JoinTiming, 'retryMs' | 'retryMaxMs'>, run: (id: string) => void) => {
  const timers = new Map<string, NodeJS.Timeout>();
  const attempts = new Map<string, number>();

  const cancel = (id: string) => {
    clearTimeout(timers.get(id));
    timers.delete(id);
  };

  const schedule = (id: string): number => {
    cancel(id);
    const tries = (attempts.get(id) ?? 0) + 1;
    attempts.set(id, tries);
    const delay = Math.min(timing.retryMs * 2 ** (tries - 1), timing.retryMaxMs);
    const timer = setTimeout(() => {
      timers.delete(id);
      run(id);
    }, delay);
    timer.unref();
    timers.set(id, timer);
    return delay;
  };

  return {
    schedule,
    cancel,
    reset: (id: string) => { attempts.delete(id); },
    ids: () => [...timers.keys()],
  };
};

export { createRetries };
