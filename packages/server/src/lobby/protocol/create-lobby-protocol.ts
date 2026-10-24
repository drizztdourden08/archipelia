/* @layer core @kind logic */
import type { FileGet, Hello, LobbyInfoRequest, SlotsSet, UploadBegin, UploadChunk } from '@drizztdourden08/archipelia-lobby-protocol';
import { markArrived } from '../checks/mark-arrived';
import { settleLobby } from '../checks/settle-lobby';
import { joinLobby } from '../join/join-lobby';
import type { LobbyContext } from '../lobby-context.type';
import type { LobbyLink, MemberRef } from '../lobby-service.type';
import { getFile } from '../member/get-file';
import { leaveLobby } from '../member/leave-lobby';
import { setReady } from '../member/set-ready';
import { setSlots } from '../member/set-slots';
import { activeMember } from '../state/active-member';
import { lobbyInfo } from './lobby-info';

const createLobbyProtocol = (ctx: LobbyContext) => {
  return {
    info: (request: LobbyInfoRequest) => lobbyInfo(ctx, request),
    active: async (ref: MemberRef) => activeMember(await ctx.book.get(ref.lobbyId), ref.memberId) !== undefined,
    join: (hello: Hello, link: LobbyLink) => joinLobby(ctx, hello, link),
    detach: (ref: MemberRef, link: LobbyLink) => {
      ctx.hub.detach(ref, link);
      ctx.uploads.forgetLater(ref);
    },
    ready: (ref: MemberRef, ready: boolean) => setReady(ctx, ref, ready),
    leave: (ref: MemberRef) => leaveLobby(ctx, ref),
    slots: async (ref: MemberRef, message: SlotsSet) => {
      const replies = await setSlots(ctx, ref, message);
      void settleLobby(ctx, ref.lobbyId).catch(() => undefined);
      return replies;
    },
    uploadBegin: (ref: MemberRef, message: UploadBegin) => ctx.uploads.begin(ref, message),
    uploadChunk: (ref: MemberRef, message: UploadChunk) => ctx.uploads.chunk(ref, message),
    arrive: (lobbyId: string) => ctx.queue(`settle:${lobbyId}`, () => markArrived(ctx, lobbyId)),
    settle: (lobbyId: string) => settleLobby(ctx, lobbyId),
    file: (ref: MemberRef, message: FileGet) => getFile(ctx, ref, message),
  };
};

export { createLobbyProtocol };
