/* @layer core @kind logic */
import { sha256Hex } from '@archipelia/lobby-protocol/node';
import type { SlotUpload } from '@archipelia/model';
import { settleLobby } from '../checks/settle-lobby';
import type { LobbyContext } from '../lobby-context.type';
import type { HostMemberInput } from '../lobby-service.type';
import { MEMBER_ID_PREFIX } from '../lobby.constants';
import { liveMembers } from '../state/live-members';

const addHostMember = async (ctx: LobbyContext, lobbyId: string, input: HostMemberInput) => {
  const files = input.slots.map((slot) => ({ slot, bytes: new TextEncoder().encode(slot.yaml) }));
  const uploads: SlotUpload[] = files.map(({ slot, bytes }) => ({
    name: slot.name, game: slot.game, yamlSha256: sha256Hex(bytes), yamlSize: bytes.length, worldVersion: slot.worldVersion, state: 'uploading',
  }));
  for (const { bytes } of files) await ctx.deps.store.writeFile(lobbyId, sha256Hex(bytes), bytes);
  const lobby = await ctx.book.commit(lobbyId, (draft) => {
    const taken = new Set(liveMembers(draft).flatMap((member) => member.slots.map((slot) => slot.name)));
    const clash = uploads.find((slot) => taken.has(slot.name));
    if (clash) throw new Error(`another player already uses the slot name ${clash.name}`);
    draft.members.push({
      id: `${MEMBER_ID_PREFIX}${draft.nextMember}`, kind: 'host', displayName: input.displayName, admission: 'approved', trust: 'verified',
      ready: true, slots: uploads, joinedAt: ctx.now(), lastSeenAt: ctx.now(),
    });
    draft.nextMember += 1;
  });
  ctx.publish(lobby);
  await settleLobby(ctx, lobbyId);
  return ctx.book.get(lobbyId);
};

export { addHostMember };
