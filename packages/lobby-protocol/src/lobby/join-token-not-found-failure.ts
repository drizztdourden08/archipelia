/* @layer protocol @kind logic */
import type { Failure } from '../protocol/protocol.type';

const joinTokenNotFoundFailure = (): Failure => ({
  code: 'lobby-not-found',
  message: 'No lobby on this server is shown with this join token. The host may have hidden it. Ask the host for the code.',
  field: 'lobby.joinToken',
});

export { joinTokenNotFoundFailure };
