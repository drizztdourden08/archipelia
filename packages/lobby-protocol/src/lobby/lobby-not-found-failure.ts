/* @layer protocol @kind logic */
import type { Failure } from '../protocol/protocol.type';

const lobbyNotFoundFailure = (): Failure => ({
  code: 'lobby-not-found',
  message: 'No lobby has this code. Check the code with the host.',
  field: 'lobby.code',
});

export { lobbyNotFoundFailure };
