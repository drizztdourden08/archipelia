/* @layer core @kind logic */
import type { ClientMessage, ServerMessage } from '@drizztdourden08/archipelia-lobby-protocol';
import type { MemberRef } from '../lobby-service.type';
import { GONE, JOINED, OTHER_UPLOAD } from './link.constants';
import type { Conversation, MemberHandler } from './link.type';

const none: ServerMessage[] = [];

const handlers: Partial<Record<ClientMessage['type'], MemberHandler>> = {
  'ready': async ({ options }, ref, message) => {
    if (message.type === 'ready') await options.protocol.ready(ref, message.ready);
    return none;
  },
  'leave': async ({ options }, ref) => {
    await options.protocol.leave(ref);
    return none;
  },
  'slots.set': ({ options }, ref, message) => (message.type === 'slots.set' ? options.protocol.slots(ref, message) : Promise.resolve(none)),
  'upload.begin': ({ options, state }, ref, message) => {
    if (message.type !== 'upload.begin') return Promise.resolve(none);
    state.upload = message.sha256;
    return options.protocol.uploadBegin(ref, message);
  },
  'upload.chunk': ({ options, state, wire }, ref, message) => {
    if (message.type !== 'upload.chunk') return Promise.resolve(none);
    if (message.sha256 !== state.upload) {
      wire.fail(OTHER_UPLOAD);
      return Promise.resolve(none);
    }
    return options.protocol.uploadChunk(ref, message);
  },
  'file.get': ({ options }, ref, message) => (message.type === 'file.get' ? options.protocol.file(ref, message) : Promise.resolve(none)),
};

const deliver = async ({ options, wire }: Conversation, ref: MemberRef, listed: ServerMessage[] | null, replies: Iterable<ServerMessage>) => {
  if (listed?.some((reply) => reply.type === 'upload.done')) await options.protocol.arrive(ref.lobbyId);
  for (const reply of listed ?? replies) {
    wire.send(reply);
    await wire.drained();
  }
  if (listed?.some((reply) => reply.type === 'upload.done')) await options.protocol.settle(ref.lobbyId);
};

const answerMember = async (conversation: Conversation, ref: MemberRef, message: ClientMessage) => {
  const handler = handlers[message.type];
  const seq = 'seq' in message ? message.seq : undefined;
  if (!handler) return conversation.wire.fail(JOINED, seq);
  if (!(await conversation.options.protocol.active(ref))) return conversation.wire.fail(GONE, seq);
  const replies = await handler(conversation, ref, message);
  return deliver(conversation, ref, message.type === 'file.get' ? null : [...replies], replies);
};

export { answerMember };
