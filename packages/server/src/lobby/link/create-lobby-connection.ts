/* @layer core @kind logic */
import type { ClientMessage, Failure } from '@archipelia/lobby-protocol';
import type { TransportEvent } from '@archipelia/lobby-protocol/node';
import {
  closeCodeOf, createError, decodeMessage, DEFAULT_LIMITS, encodeMessage, HELLO_TIMEOUT_MS, PRE_WELCOME_MAX_MESSAGE_BYTES,
} from '@archipelia/lobby-protocol';
import type { LobbyLink } from '../lobby-service.type';
import { answerFirst } from './answer-first';
import { answerMember } from './answer-member';
import { keepAlive } from './keep-alive';
import { BINARY, HELLO_FIRST, NO_HELLO } from './link.constants';
import type { ConnectionOptions, ConnectionState, Conversation, Wire } from './link.type';
import { seqOf } from './seq-of';

const internal = (error: unknown): Failure => ({
  code: 'internal',
  message: `The server hit a fault. Tell the host: ${error instanceof Error ? error.message : String(error)}.`,
});

const createLobbyConnection = (options: ConnectionOptions) => {
  const { transport, protocol } = options;
  const state: ConnectionState = { welcomed: false };
  const link: LobbyLink = { send: (message) => transport.send(encodeMessage(message)), close: (code) => transport.close(code) };
  const fail = (failure: Failure, re?: number, welcomed = state.welcomed) => {
    const error = createError(failure, { welcomed, ...(re === undefined ? {} : { re }) });
    link.send(error);
    const code = closeCodeOf(error);
    if (code !== null) link.close(code);
  };
  const helloTimer = () => setTimeout(() => fail(NO_HELLO), HELLO_TIMEOUT_MS).unref();
  let hello = helloTimer();
  const armHello = () => {
    clearTimeout(hello);
    hello = helloTimer();
  };
  const wire: Wire = { link, send: link.send, fail, helloArrived: () => clearTimeout(hello), infoAnswered: armHello };
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
    if (event.kind === 'binary') return fail(BINARY, undefined, false);
    if (event.kind === 'text') return answer(event.text);
    clearTimeout(hello);
    stopPings();
    if (state.ref) protocol.detach(state.ref, link);
    return undefined;
  };

  let tail: Promise<unknown> = Promise.resolve();
  transport.listen((event) => {
    tail = tail.then(() => onEvent(event)).catch((error: unknown) => fail(internal(error), event.kind === 'text' ? seqOf(event.text) : undefined));
  });
  return link;
};

export { createLobbyConnection };
