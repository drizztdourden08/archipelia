/* @layer electron-main @kind logic */
import { TEXT } from './joins.constants';
import type { LinkMessage, Waiter } from './joins.type';

const createWaiterBook = () => {
  const waiters = new Set<Waiter>();
  let closed = false;

  const take = (message: LinkMessage) => {
    const waiter = [...waiters].find((candidate) => candidate.match(message));
    if (!waiter) return;
    waiters.delete(waiter);
    waiter.resolve(message);
  };

  const closeAll = () => {
    closed = true;
    for (const waiter of waiters) waiter.reject(new Error(TEXT.closed));
    waiters.clear();
  };

  const waitFor = (match: (message: LinkMessage) => boolean, timeoutMs: number) => new Promise<LinkMessage>((resolve, reject) => {
    if (closed) {
      reject(new Error(TEXT.closed));
      return;
    }
    const timer = setTimeout(() => {
      waiters.delete(waiter);
      reject(new Error(TEXT.noReply));
    }, timeoutMs);
    const waiter: Waiter = {
      match,
      resolve: (message) => { clearTimeout(timer); resolve(message); },
      reject: (error) => { clearTimeout(timer); reject(error); },
    };
    waiters.add(waiter);
  });

  return { take, closeAll, waitFor };
};

export { createWaiterBook };
