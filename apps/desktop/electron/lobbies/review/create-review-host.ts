/* @layer electron-main @kind logic */
import type { HostHook } from '@drizztdourden08/archipelia-lobby-protocol/testing';
import type { LobbyReviewHost } from '../../../src/lobbies/lobbies.type';
import { HOST_STEP_TIMEOUT_MS } from './review.constants';

const createReviewHost = (announce: (host: LobbyReviewHost) => void) => {
  const waiting = new Map<number, () => void>();
  let next = 0;

  const hook: HostHook = (line) =>
    new Promise((resolve, reject) => {
      next += 1;
      const id = next;
      const timer = setTimeout(() => {
        waiting.delete(id);
        reject(new Error(`the screen did not answer the host step ${line.action}`));
      }, HOST_STEP_TIMEOUT_MS);
      waiting.set(id, () => {
        clearTimeout(timer);
        waiting.delete(id);
        resolve();
      });
      announce({ id, action: line.action, ...(typeof line.world === 'string' ? { world: line.world } : {}) });
    });

  const done = (id: number) => waiting.get(id)?.();

  return { hook, done };
};

export { createReviewHost };
