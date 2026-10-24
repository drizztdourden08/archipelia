/* @layer core @kind logic */
import { unzipSync } from 'fflate';
import type { FileGet, ServerMessage } from '@drizztdourden08/archipelia-lobby-protocol';
import { createError, DEFAULT_LIMITS } from '@drizztdourden08/archipelia-lobby-protocol';
import type { Lobby, LobbyRoomFile } from '@archipelia/model';
import type { LobbyContext } from '../lobby-context.type';
import type { MemberRef } from '../lobby-service.type';
import { NO_FILE } from './member.constants';

const chunksOf = function* (bytes: Uint8Array, base: { re?: number; fileId: string }): Generator<ServerMessage> {
  for (let offset = 0; offset < bytes.length; offset += DEFAULT_LIMITS.chunkBytes) {
    yield { type: 'file.chunk', ...base, offset, data: Buffer.from(bytes.subarray(offset, offset + DEFAULT_LIMITS.chunkBytes)).toString('base64') };
  }
};

const fileMessages = function* (bytes: Uint8Array, base: { re?: number; fileId: string }, sha256: string): Generator<ServerMessage> {
  yield* chunksOf(bytes, base);
  yield { type: 'file.done', ...base, sha256 };
};

const fileOf = (lobby: Lobby | undefined, ref: MemberRef, fileId: string): LobbyRoomFile | undefined => {
  const member = lobby?.members.find((candidate) => candidate.id === ref.memberId);
  if (member?.admission !== 'approved') return undefined;
  return lobby?.room?.files.find((file) => file.fileId === fileId && member.slots.some((slot) => slot.name === file.slot));
};

const readEntry = async (ctx: LobbyContext, lobby: Lobby, file: LobbyRoomFile) => {
  const zip = lobby.room ? await ctx.deps.runner.output.readBytes(`${lobby.sessionId}/output/${lobby.room.zip}`) : null;
  return zip ? unzipSync(zip, { filter: (entry) => entry.name === file.entry })[file.entry] : undefined;
};

const getFile = async (ctx: LobbyContext, ref: MemberRef, message: FileGet): Promise<Iterable<ServerMessage>> => {
  const re = message.seq === undefined ? {} : { re: message.seq };
  const lobby = await ctx.book.get(ref.lobbyId);
  const file = fileOf(lobby, ref, message.fileId);
  const bytes = lobby && file ? await readEntry(ctx, lobby, file) : undefined;
  if (!file || !bytes) return [createError(NO_FILE, { welcomed: true, ...re })];
  const base = { fileId: file.fileId, ...re };
  return fileMessages(bytes, base, file.sha256);
};

export { getFile };
