/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { HEARTBEAT_LIMIT_MS, HEARTBEAT_MS, MS_PER_SECOND } from './review.constants';

const withHeartbeat = async <T>(tour: AppReviewTour, work: Promise<T>, what: () => string, limitMs = HEARTBEAT_LIMIT_MS): Promise<T> => {
  const state = { done: false, beats: 0 };
  const finished = () => state.done;
  const beat = async () => {
    while (!state.done) {
      await tour.delay(HEARTBEAT_MS);
      if (finished()) return;
      state.beats += 1;
      tour.check(`still-running-${state.beats}`, true, what(), '');
    }
  };
  let timer: ReturnType<typeof setTimeout> | undefined;
  const expired = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => reject(new Error(`gave up after ${Math.round(limitMs / MS_PER_SECOND)} s: ${what()}`)), limitMs);
  });
  void beat();
  try {
    return await Promise.race([work, expired]);
  } finally {
    state.done = true;
    clearTimeout(timer);
  }
};

export { withHeartbeat };
