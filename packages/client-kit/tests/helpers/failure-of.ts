/* @layer tests @kind helper */
import { isKitError } from '../../src';

const failureOf = (run: () => unknown): { message: string; issues: { key: string; code: string }[] } => {
  try {
    run();
  } catch (error) {
    if (isKitError(error)) return { message: error.message, issues: [...error.issues] };
    throw error;
  }
  throw new Error('expected a failure');
};

export { failureOf };
