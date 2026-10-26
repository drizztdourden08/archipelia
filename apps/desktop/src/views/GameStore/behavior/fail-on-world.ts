/* @layer renderer-app @kind logic */
import { failWith } from '../../../hooks/fail-with';
import { reasonOf } from './reason-of';

const causeOf = (err: unknown): unknown => (err instanceof Error && err.cause !== undefined ? err.cause : err);

const failOnWorld = <T,>(sentence: string, work: () => Promise<T>) => async (): Promise<T> => {
  try {
    return await failWith(sentence, work)();
  } catch (err) {
    throw new Error(reasonOf(causeOf(err), sentence), { cause: err });
  }
};

export { failOnWorld };
