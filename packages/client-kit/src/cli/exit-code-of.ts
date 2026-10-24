/* @layer client-kit @kind logic */
import { isKitError } from '../errors/is-kit-error';
import { EXIT_FAILED, EXIT_USAGE } from './cli.constants';

const isParseFault = (error: unknown): boolean =>
  error instanceof Error && 'code' in error && String(error.code).startsWith('ERR_PARSE_ARGS');

const exitCodeOf = (error: unknown): number =>
  (isKitError(error) && error.code === 'usage') || isParseFault(error) ? EXIT_USAGE : EXIT_FAILED;

export { exitCodeOf };
