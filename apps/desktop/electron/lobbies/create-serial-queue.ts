/* @layer electron-main @kind logic */
const createSerialQueue = () => {
  let tail: Promise<unknown> = Promise.resolve();
  return <T>(work: () => Promise<T>): Promise<T> => {
    const run = tail.then(work, work);
    tail = run.catch(() => undefined);
    return run;
  };
};

export { createSerialQueue };
