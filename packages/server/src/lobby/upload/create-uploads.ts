/* @layer core @kind logic */
import type { Failure, ServerMessage, UploadBegin, UploadChunk } from '@archipelia/lobby-protocol';
import { createError } from '@archipelia/lobby-protocol';
import { sha256Hex } from '@archipelia/lobby-protocol/node';
import type { LobbyContext } from '../lobby-context.type';
import type { MemberRef } from '../lobby-service.type';
import { memberFiles } from '../state/member-files';
import { HASH_MISMATCH, NOT_BEGUN, PAST_SIZE, UNEXPECTED } from './upload.constants';
import type { UploadPart } from './upload.type';
import { uploadLimit } from './upload-limit';

const errorOf = (failure: Failure, re?: number): ServerMessage[] => [createError(failure, { welcomed: true, ...(re === undefined ? {} : { re }) })];

const badMessage = (message: string): ServerMessage[] => errorOf({ code: 'bad-message', message });

const createUploads = (ctx: LobbyContext) => {
  const parts = new Map<string, UploadPart>();
  const keyOf = (ref: MemberRef, sha256: string) => `${ref.lobbyId}/${sha256}`;

  const begin = async (ref: MemberRef, message: UploadBegin): Promise<ServerMessage[]> => {
    const lobby = await ctx.book.get(ref.lobbyId);
    const member = lobby?.members.find((candidate) => candidate.id === ref.memberId);
    if (!lobby || !member) return errorOf(UNEXPECTED, message.seq);
    const files = memberFiles(lobby, member);
    const declared = files.some((file) => file.sha256 === message.sha256 && file.kind === message.kind && file.size === message.size);
    const failure = uploadLimit(lobby, message, files) ?? (declared ? null : UNEXPECTED);
    if (failure) return errorOf(failure, message.seq);
    const ready = { type: 'upload.ready' as const, re: message.seq, sha256: message.sha256 };
    if (await ctx.deps.store.hasFile(lobby.id, message.sha256)) {
      return [{ ...ready, offset: message.size }, { type: 'upload.done', sha256: message.sha256, ok: true }];
    }
    const part = parts.get(keyOf(ref, message.sha256)) ?? { size: message.size, chunks: [], received: 0 };
    parts.set(keyOf(ref, message.sha256), part);
    return [{ ...ready, offset: part.received }];
  };

  const finish = async (ref: MemberRef, sha256: string, part: UploadPart): Promise<ServerMessage[]> => {
    const whole = Buffer.concat(part.chunks);
    if (sha256Hex(whole) !== sha256) return errorOf(HASH_MISMATCH);
    await ctx.deps.store.writeFile(ref.lobbyId, sha256, whole);
    return [{ type: 'upload.done', sha256, ok: true }];
  };

  const chunk = (ref: MemberRef, message: UploadChunk): Promise<ServerMessage[]> => {
    const key = keyOf(ref, message.sha256);
    const part = parts.get(key);
    if (!part) return Promise.resolve(badMessage(NOT_BEGUN));
    if (message.offset !== part.received) return Promise.resolve(badMessage(`The chunk starts at ${message.offset}. The upload is at ${part.received}.`));
    const bytes = Buffer.from(message.data, 'base64');
    if (part.received + bytes.length > part.size) {
      parts.delete(key);
      return Promise.resolve(badMessage(PAST_SIZE));
    }
    part.chunks.push(bytes);
    part.received += bytes.length;
    if (part.received < part.size) return Promise.resolve([]);
    parts.delete(key);
    return finish(ref, message.sha256, part);
  };

  const forget = (lobbyId: string) => {
    for (const key of parts.keys()) if (key.startsWith(`${lobbyId}/`)) parts.delete(key);
  };

  return { begin, chunk, forget };
};

export { createUploads };
