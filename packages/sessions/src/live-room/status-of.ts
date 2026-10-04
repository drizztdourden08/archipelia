/* @layer core @kind logic */
import type { PlayerStatus } from './live-room.type';
import { STATUS_STEPS } from './client-status.constants';

const statusOf = (code: unknown): PlayerStatus => {
  if (typeof code !== 'number') return 'unknown';
  return STATUS_STEPS.find(([floor]) => code >= floor)?.[1] ?? 'offline';
};

export { statusOf };
