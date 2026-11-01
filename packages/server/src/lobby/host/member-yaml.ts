/* @layer core @kind logic */
import type { MemberYaml } from '@archipelia/model';
import type { LobbyContext } from '../lobby-context.type';

const memberYaml = async (ctx: LobbyContext, lobbyId: string, memberId: string): Promise<MemberYaml> => {
  const lobby = await ctx.book.get(lobbyId);
  if (!lobby) throw new Error(`no lobby has the id ${lobbyId}`);
  const member = lobby.members.find((candidate) => candidate.id === memberId);
  if (!member) throw new Error(`no player of this lobby has the id ${memberId}`);
  const decoder = new TextDecoder();
  const slots = await Promise.all(member.slots.map(async (slot) => {
    const bytes = await ctx.deps.store.readFile(lobbyId, slot.yamlSha256);
    return { name: slot.name, game: slot.game, yaml: bytes ? decoder.decode(bytes) : null };
  }));
  return { memberId, slots };
};

export { memberYaml };
