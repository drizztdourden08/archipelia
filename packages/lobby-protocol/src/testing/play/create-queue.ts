/* @layer testing @kind logic */
import type { Queue } from './play.type';

const createQueue = <T>(timeoutMs: number, what: string): Queue<T> => {
  const items: T[] = [];
  let waiter: ((item: T) => void) | null = null;

  const push = (item: T) => {
    if (waiter) {
      const resolve = waiter;
      waiter = null;
      resolve(item);
    } else items.push(item);
  };

  const pull = () =>
    new Promise<T>((resolve, reject) => {
      if (items.length > 0) {
        resolve(items.shift() as T);
        return;
      }
      const timer = setTimeout(() => {
        waiter = null;
        reject(new Error(`timed out after ${timeoutMs} ms waiting for ${what}`));
      }, timeoutMs);
      waiter = (item) => {
        clearTimeout(timer);
        resolve(item);
      };
    });

  return { push, pull };
};

export { createQueue };
