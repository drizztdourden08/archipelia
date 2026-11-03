/* @layer core @kind logic */
import type { Failure } from '@drizztdourden08/archipelia-lobby-protocol';

const seatFailure = (message: string): Failure => ({ code: 'seat-unavailable', message, field: 'seat' });

export { seatFailure };
