/* @layer core @kind logic */
import type { ClientMessage, Failure } from '@archipelia/lobby-protocol';
import type { TransportEvent } from '@archipelia/lobby-protocol/node';
import { closeCodeOf, createError, decodeMessage, DEFAULT_LIMITS, encodeMessage, PRE_WELCOME_MAX_MESSAGE_BYTES } from '@archipelia/lobby-protocol';
import type { LobbyLink } from '../lobby-service.type';
import { answerFirst } from './answer-first';
import { answerMember } from './answer-member';
import { faultOf } from './fault-of';
import { helloClock } from './hello-clock';
import { keepAlive } from './keep-alive';
import { BINARY, HELLO_FIRST, NO_HELLO } from './link.constants';
import type { ConnectionOptions, ConnectionState, Conversation, Wire } from './link.type';
import { seqOf } from './seq-of';

const createLobbyConnection = (options: ConnectionOptions) => {
  const { transport, protocol } = options;
  const state: ConnectionState = { welcomed: false, closed: false };
  const link: LobbyLink = {
    send: (message) => transport.send(encodeMessage(message)),
    close: (code) => {
      state.closed = true;
      transport.close(code);
    },
  };
  const fail = (failure: Failure, re?: number, welcomed = state.welcomed) => {
    const error = createError(failure, { welcomed, ...(re === undefined ? {} : { re }) });
    link.send(error);
    const code = closeCodeOf(error);
    if (code !== null) link.close(code);
  };
  const clock = helloClock(() => fail(NO_HELLO));
  const helloArrived = () => {
    clock.stop();
    options.limit.bytes = DEFAULT_LIMITS.maxMessageBytes;
  };
  const wire: Wire = { link, send: link.send, fail, helloArrived, infoAnswered: clock.again, drained: options.drained ?? (() => Promise.resolve()) };
  const conversation: Conversation = { options, state, wire };
  const stopPings = keepAlive(options.keepAlive, link);

  const answer = (text: string) => {
    const decoded = decodeMessage(text, { direction: 'c2s', maxBytes: state.welcomed ? DEFAULT_LIMITS.maxMessageBytes : PRE_WELCOME_MAX_MESSAGE_BYTES });
    if (!decoded.ok) return fail(decoded.failure, seqOf(text));
    const message = decoded.message as ClientMessage;
    if (state.welcomed) return state.ref ? answerMember(conversation, state.ref, message) : undefined;
    if (message.type === 'lobby.info' || message.type === 'hello') return answerFirst(conversation, message);
    return fail(HELLO_FIRST, seqOf(text));
  };

  const onEvent = async (event: TransportEvent) => {
    if (state.closed && event.kind !== 'close') return undefined;
    if (event.kind === 'binary') return fail(BINARY, undefined, false);
    if (event.kind === 'text') return answer(event.text);
    state.closed = true;
    clock.stop();
    stopPings();
    if (state.ref) protocol.detach(state.ref, link);
    return undefined;
  };

  let tail: Promise<unknown> = Promise.resolve();
  transport.listen((event) => {
    tail = tail.then(() => onEvent(event)).catch((error: unknown) => fail(faultOf(error, options.log), event.kind === 'text' ? seqOf(event.text) : undefined));
  });
  return link;
};

export { createLobbyConnection };
