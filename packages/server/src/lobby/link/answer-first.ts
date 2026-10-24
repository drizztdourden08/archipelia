/* @layer core @kind logic */
import type { Hello, LobbyInfoRequest } from '@archipelia/lobby-protocol';
import { rateLimitedFailure } from '@archipelia/lobby-protocol';
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

const answerFirst = (conversation: Conversation, message: LobbyInfoRequest | Hello) =>
  message.type === 'lobby.info' ? answerInfo(conversation, message) : answerHello(conversation, message);

export { answerFirst };
