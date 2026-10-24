/* @layer core @kind logic */

const createQueue = () => {
  const tails = new Map<string, Promise<unknown>>();
  return <T>(key: string, task: () => Promise<T>): Promise<T> => {
    const next = (tails.get(key) ?? Promise.resolve()).then(task, task);
    tails.set(key, next.catch(() => undefined));
    return next;
  };
};

export { createQueue };
