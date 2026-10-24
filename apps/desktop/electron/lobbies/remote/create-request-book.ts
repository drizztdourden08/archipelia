/* @layer electron-main @kind logic */
import type { AdminLink, AdminMessage, RequestBook, Waiter } from '../lobbies.type';
import { CALL_TIMEOUT_MS, CLOSED_TEXT, TIMEOUT_TEXT } from './remote.constants';

const createRequestBook = (link: AdminLink): RequestBook => {
  const waiting = new Map<number, Waiter>();
  let next = 0;
  let open = true;

  const failAll = (error: Error) => {
    open = false;
    for (const waiter of waiting.values()) {
      clearTimeout(waiter.timer);
      waiter.reject(error);
    }
    waiting.clear();
  };

  const settle = (message: AdminMessage) => {
    const id = typeof message.re === 'number' ? message.re : -1;
    const waiter = waiting.get(id);
    if (!waiter) return;
    clearTimeout(waiter.timer);
    waiting.delete(id);
    waiter.resolve(message);
  };

  const request = (body: Record<string, unknown>): Promise<AdminMessage> =>
    new Promise((resolve, reject) => {
      if (!open) {
        reject(new Error(CLOSED_TEXT));
        return;
      }
      next += 1;
      const id = next;
      const timer = setTimeout(() => {
        waiting.delete(id);
        reject(new Error(TIMEOUT_TEXT));
      }, CALL_TIMEOUT_MS);
      waiting.set(id, { resolve, reject, timer });
      link.send(JSON.stringify({ ...body, seq: id }));
    });

  return { request, settle, failAll, alive: () => open };
};

export { createRequestBook };
