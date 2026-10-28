/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { LISTEN_POLL_MS, LISTEN_WAIT_MS, MS_PER_SECOND } from './review.constants';

const accepts = (port: number): Promise<boolean> =>
  new Promise((resolve) => {
    const socket = new WebSocket(`ws://127.0.0.1:${port}`);
    socket.onopen = () => {
      socket.close();
      resolve(true);
    };
    socket.onerror = () => resolve(false);
  });

const serverListens = async (tour: AppReviewTour, port: number): Promise<void> => {
  const deadline = performance.now() + LISTEN_WAIT_MS;
  while (!(await accepts(port))) {
    if (performance.now() >= deadline) throw new Error(`nothing accepted a connection on port ${port} within ${LISTEN_WAIT_MS / MS_PER_SECOND} s`);
    await tour.delay(LISTEN_POLL_MS);
  }
};

export { serverListens };
