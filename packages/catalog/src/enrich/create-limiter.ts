/* @layer core @kind logic */

const createLimiter = (max: number) => {
  let active = 0;
  const waiting: (() => void)[] = [];

  const release = () => {
    active -= 1;
    waiting.shift()?.();
  };

  return async <T,>(task: () => Promise<T>): Promise<T> => {
    if (active >= max) await new Promise<void>((resolve) => { waiting.push(resolve); });
    active += 1;
    try {
      return await task();
    } finally {
      release();
    }
  };
};

export { createLimiter };
