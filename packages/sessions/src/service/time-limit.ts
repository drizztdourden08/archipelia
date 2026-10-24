/* @layer core @kind logic */
import type { TimeLimit } from './produce-session.type';

const timeLimit = (signal: AbortSignal | undefined, timeoutMs: number | undefined): TimeLimit => {
  if (!timeoutMs) return { signal, expired: () => false };
  const timer = AbortSignal.timeout(timeoutMs);
  return { signal: signal ? AbortSignal.any([signal, timer]) : timer, expired: () => timer.aborted };
};

export { timeLimit };
