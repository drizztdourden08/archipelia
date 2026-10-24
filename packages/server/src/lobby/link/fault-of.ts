/* @layer core @kind logic */
import type { Failure } from '@drizztdourden08/archipelia-lobby-protocol';
import { STORE_FAULT } from '../state/state.constants';
import { GENERIC_FAULT } from './link.constants';

const faultOf = (error: unknown, log: (message: string) => void): Failure => {
  const detail = error instanceof Error ? error.message : String(error);
  log(`lobby connection fault: ${detail}`);
  const shown = error instanceof Error && error.name === STORE_FAULT ? detail : GENERIC_FAULT;
  return { code: 'internal', message: `The server hit a fault. Tell the host: ${shown}.` };
};

export { faultOf };
