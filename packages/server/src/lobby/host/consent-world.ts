/* @layer core @kind logic */
import { settleLobby } from '../checks/settle-lobby';
import type { LobbyContext } from '../lobby-context.type';

const consentWorld = async (ctx: LobbyContext, lobbyId: string, sha256: string, allowed: boolean) => {
  await ctx.book.commit(lobbyId, (draft) => {
    const worlds = draft.worlds.filter((world) => world.sha256 === sha256);
    if (worlds.length === 0) throw new Error(`no world of this lobby has the hash ${sha256}`);
    for (const world of worlds) world.consent = { allowed, at: ctx.now() };
    for (const slot of draft.members.flatMap((member) => member.slots)) {
      if (slot.worldSha256 === sha256 && slot.state === 'waiting-consent') slot.state = 'checking';
    }
  });
  await settleLobby(ctx, lobbyId);
  return ctx.book.get(lobbyId);
};

export { consentWorld };
