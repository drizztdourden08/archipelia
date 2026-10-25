/* @layer electron-main @kind logic */
import type { JoinRecord } from './joins.type';
import { isJoinStop } from './is-join-stop';

const stopPatch = (error: unknown): Partial<JoinRecord> => {
  const message = error instanceof Error && error.message !== '' ? error.message : String(error);
  if (!isJoinStop(error)) return { state: 'offline', message };
  return error.forget ? { state: error.state, message, token: undefined } : { state: error.state, message };
};

export { stopPatch };
