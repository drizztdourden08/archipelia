/* @layer core @kind logic */
import type { Failure } from '@drizztdourden08/archipelia-lobby-protocol';
import { REJECTED } from './state.constants';

const rejectionOf = (error: unknown): Failure | null =>
  error instanceof Error && error.name === REJECTED && 'failure' in error ? (error.failure as Failure) : null;

export { rejectionOf };
