/* @layer renderer-app @kind logic */
import { IPC_PREFIX } from './reason-of.constants';

const reasonOf = (err: unknown, sentence: string): string => {
  const reason = (err instanceof Error ? err.message : String(err)).replace(IPC_PREFIX, '').trim();
  return reason || sentence;
};

export { reasonOf };
