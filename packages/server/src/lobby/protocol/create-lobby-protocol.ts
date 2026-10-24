/* @layer core @kind logic */
import type { FileGet, Hello, LobbyInfoRequest, SlotsSet, UploadBegin, UploadChunk } from '@archipelia/lobby-protocol';
import { markArrived } from '../checks/mark-arrived';
import { settleLobby } from '../checks/settle-lobby';
import { joinLobby } from '../join/join-lobby';
import type { LobbyContext } from '../lobby-context.type';
import type { LobbyLink, MemberRef } from '../lobby-service.type';
import { getFile } from '../member/get-file';
import { leaveLobby } from '../member/leave-lobby';
import { setReady } from '../member/set-ready';
import { setSlots } from '../member/set-slots';
import { createUploads } from '../upload/create-uploads';
import { lobbyInfo } from './lobby-info';

const createLobbyProtocol = (ctx: LobbyContext) => {
  const uploads = createUploads(ctx);
  return {
    info: (request: LobbyInfoRequest) => lobbyInfo(ctx, request),
    join: (hello: Hello, link: LobbyLink) => joinLobby(ctx, hello, link),
    detach: (ref: MemberRef, link: LobbyLink) => ctx.hub.detach(ref, link),
    ready: (ref: MemberRef, ready: boolean) => setReady(ctx, ref, ready),
    leave: (ref: MemberRef) => leaveLobby(ctx, ref),
    slots: (ref: MemberRef, message: SlotsSet) => setSlots(ctx, ref, message),
    uploadBegin: (ref: MemberRef, message: UploadBegin) => uploads.begin(ref, message),
    uploadChunk: (ref: MemberRef, message: UploadChunk) => uploads.chunk(ref, message),
    arrive: (lobbyId: string) => ctx.queue(`settle:${lobbyId}`, () => markArrived(ctx, lobbyId)),
    settle: (lobbyId: string) => settleLobby(ctx, lobbyId),
    file: (ref: MemberRef, message: FileGet) => getFile(ctx, ref, message),
  };
};

export { createLobbyProtocol };
