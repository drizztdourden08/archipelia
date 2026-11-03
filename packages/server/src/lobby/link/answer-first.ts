/* @layer core @kind logic */
import type { Hello, LobbyBrowseRequest, LobbyInfoRequest } from '@drizztdourden08/archipelia-lobby-protocol';
import { rateLimitedFailure } from '@drizztdourden08/archipelia-lobby-protocol';
import type { Conversation } from './link.type';

const answerInfo = async ({ options, wire }: Conversation, request: LobbyInfoRequest) => {
  const retry = options.limiter.askInfo(options.address);
  if (retry !== null) return wire.fail(rateLimitedFailure(retry), request.seq);
  const result = await options.protocol.info(request);
  if (result.ok) {
    wire.send(result.value);
    wire.infoAnswered();
    return undefined;
  }
  if (result.failure.code === 'lobby-not-found') options.limiter.miss(options.address);
  return wire.fail(result.failure, request.seq);
};

const answerBrowse = async ({ options, wire }: Conversation, request: LobbyBrowseRequest) => {
  const retry = options.limiter.askInfo(options.address);
  if (retry !== null) return wire.fail(rateLimitedFailure(retry), request.seq);
  const result = await options.protocol.browse(request);
  if (!result.ok) return wire.fail(result.failure, request.seq);
  wire.send(result.value);
  wire.infoAnswered();
  return undefined;
};

const answerHello = async ({ options, state, wire }: Conversation, hello: Hello) => {
  const retry = options.limiter.blocked(options.address);
  if (retry !== null) return wire.fail(rateLimitedFailure(retry), hello.seq);
  const result = await options.protocol.join(hello, wire.link);
  if (result.ok) {
    state.welcomed = true;
    state.ref = result.value;
    wire.helloArrived();
    return undefined;
  }
  if (result.failure.code === 'lobby-not-found') options.limiter.miss(options.address);
  return wire.fail(result.failure, hello.seq);
};

const answerFirst = (conversation: Conversation, message: LobbyInfoRequest | LobbyBrowseRequest | Hello) => {
  if (message.type === 'lobby.info') return answerInfo(conversation, message);
  if (message.type === 'lobby.browse') return answerBrowse(conversation, message);
  return answerHello(conversation, message);
};

export { answerFirst };
