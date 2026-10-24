/* @layer core @kind logic */
import type { ClientMessage, ServerMessage } from '@archipelia/lobby-protocol';
import type { MemberRef } from '../lobby-service.type';
import { JOINED, OTHER_UPLOAD } from './link.constants';
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

const answerMember = async (conversation: Conversation, ref: MemberRef, message: ClientMessage) => {
  const handler = handlers[message.type];
  if (!handler) return conversation.wire.fail(JOINED, 'seq' in message ? message.seq : undefined);
  const replies = await handler(conversation, ref, message);
  const done = replies.some((reply) => reply.type === 'upload.done');
  if (done) await conversation.options.protocol.arrive(ref.lobbyId);
  for (const reply of replies) conversation.wire.send(reply);
  if (done) await conversation.options.protocol.settle(ref.lobbyId);
  return undefined;
};

export { answerMember };
