/* @layer core @kind logic */
import type { Failure, ServerMessage, UploadBegin, UploadChunk } from '@archipelia/lobby-protocol';
import { createError } from '@archipelia/lobby-protocol';
import { sha256Hex } from '@archipelia/lobby-protocol/node';
import type { LobbyContext } from '../lobby-context.type';
import type { MemberRef } from '../lobby-service.type';
import { activeMember } from '../state/active-member';
import { usedFiles } from '../state/used-files';
import { HASH_MISMATCH, MAX_PENDING_BYTES, NOT_BEGUN, NOT_MEMBER, PART_TTL_MS, PAST_SIZE, SERVER_BUSY, UNEXPECTED } from './upload.constants';
import type { UploadPart } from './upload.type';
import { uploadLimit } from './upload-limit';

const errorOf = (failure: Failure, re?: number): ServerMessage[] => [createError(failure, { welcomed: true, ...(re === undefined ? {} : { re }) })];

const badMessage = (message: string): ServerMessage[] => errorOf({ code: 'bad-message', message });

const createUploads = (context: () => LobbyContext) => {
  const parts = new Map<string, UploadPart>();
  const prefixOf = (ref: MemberRef) => `${ref.lobbyId}/${ref.memberId}/`;
  const keyOf = (ref: MemberRef, sha256: string) => `${prefixOf(ref)}${sha256}`;
  const pending = () => [...parts.values()].reduce((sum, part) => sum + part.size, 0);
  const drop = (prefix: string) => {
    for (const key of parts.keys()) if (key.startsWith(prefix)) parts.delete(key);
  };

  const begin = async (ref: MemberRef, message: UploadBegin): Promise<ServerMessage[]> => {
    const ctx = context();
    const lobby = await ctx.book.get(ref.lobbyId);
    const member = activeMember(lobby, ref.memberId);
    if (!lobby || !member) return errorOf(NOT_MEMBER, message.seq);
    const files = usedFiles(lobby, member);
    const declared = files.some((file) => file.sha256 === message.sha256 && file.kind === message.kind && file.size === message.size);
    const failure = uploadLimit(lobby, message, files) ?? (declared ? null : UNEXPECTED);
    if (failure) return errorOf(failure, message.seq);
    const ready = { type: 'upload.ready' as const, re: message.seq, sha256: message.sha256 };
    if (await ctx.deps.store.hasFile(lobby.id, message.sha256)) {
      return [{ ...ready, offset: message.size }, { type: 'upload.done', sha256: message.sha256, ok: true }];
    }
    const known = parts.get(keyOf(ref, message.sha256));
    if (!known && pending() + message.size > MAX_PENDING_BYTES) return errorOf(SERVER_BUSY, message.seq);
    const part = known ?? { size: message.size, chunks: [], received: 0 };
    parts.set(keyOf(ref, message.sha256), part);
    return [{ ...ready, offset: part.received }];
  };

  const finish = async (ref: MemberRef, sha256: string, part: UploadPart): Promise<ServerMessage[]> => {
    const whole = Buffer.concat(part.chunks);
    if (sha256Hex(whole) !== sha256) return errorOf(HASH_MISMATCH);
    await context().deps.store.writeFile(ref.lobbyId, sha256, whole);
    return [{ type: 'upload.done', sha256, ok: true }];
  };

  const chunk = async (ref: MemberRef, message: UploadChunk): Promise<ServerMessage[]> => {
    const key = keyOf(ref, message.sha256);
    const part = parts.get(key);
    if (!activeMember(await context().book.get(ref.lobbyId), ref.memberId)) return errorOf(NOT_MEMBER);
    if (!part) return badMessage(NOT_BEGUN);
    if (message.offset !== part.received) return badMessage(`The chunk starts at ${message.offset}. The upload is at ${part.received}.`);
    const bytes = Buffer.from(message.data, 'base64');
    if (part.received + bytes.length > part.size) {
      parts.delete(key);
      return badMessage(PAST_SIZE);
    }
    part.chunks.push(bytes);
    part.received += bytes.length;
    if (part.received < part.size) return [];
    parts.delete(key);
    return finish(ref, message.sha256, part);
  };

  const forgetMember = (ref: MemberRef) => drop(prefixOf(ref));

  const forgetLater = (ref: MemberRef) => {
    setTimeout(() => {
      if (!context().hub.connected(ref.lobbyId).includes(ref.memberId)) forgetMember(ref);
    }, PART_TTL_MS).unref();
  };

  const forgetLobby = (lobbyId: string) => drop(`${lobbyId}/`);

  return { begin, chunk, forgetLater, forgetLobby, forgetMember, pending };
};

export { createUploads };
