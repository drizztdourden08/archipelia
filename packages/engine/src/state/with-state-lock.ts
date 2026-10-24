/* @layer core @kind logic */

const tails = new Map<string, Promise<unknown>>();

const withStateLock = <T>(engineRoot: string, task: () => Promise<T>): Promise<T> => {
  const run = (tails.get(engineRoot) ?? Promise.resolve()).then(task, task);
  tails.set(engineRoot, run.catch(() => undefined));
  return run;
};

export { withStateLock };
