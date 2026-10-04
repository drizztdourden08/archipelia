/* @layer renderer-app @kind logic */
import { logFailure } from './log-failure';

const failWith = <T,>(sentence: string, work: () => Promise<T>) => async (): Promise<T> => {
  try {
    return await work();
  } catch (err) {
    logFailure(sentence, err);
    throw new Error(sentence, { cause: err });
  }
};

export { failWith };
