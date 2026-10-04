/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { HEARTBEAT_MS } from './review.constants';

const withHeartbeat = async <T>(tour: AppReviewTour, work: Promise<T>, what: () => string): Promise<T> => {
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
  void beat();
  try {
    return await work;
  } finally {
    state.done = true;
  }
};

export { withHeartbeat };
