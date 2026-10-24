/* @layer core @kind logic */
import type { Failure } from '@drizztdourden08/archipelia-lobby-protocol';
import { REJECTED } from './state.constants';

const rejected = (failure: Failure): Error => Object.assign(new Error(failure.message), { name: REJECTED, failure });

export { rejected };
