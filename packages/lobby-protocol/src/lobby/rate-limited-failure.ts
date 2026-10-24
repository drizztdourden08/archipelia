/* @layer protocol @kind logic */
import type { Failure } from '../protocol/protocol.type';

const rateLimitedFailure = (retryAfter: number): Failure => ({
  code: 'rate-limited',
  message: `Too many attempts from this address. Try again in ${retryAfter} seconds.`,
  retryAfter,
});

export { rateLimitedFailure };
