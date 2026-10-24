/* @layer core @kind logic */
import type { Failure } from '@archipelia/lobby-protocol';
import { REJECTED } from './state.constants';

const rejected = (failure: Failure): Error => Object.assign(new Error(failure.message), { name: REJECTED, failure });

export { rejected };
