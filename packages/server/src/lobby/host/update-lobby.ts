/* @layer core @kind logic */
import type { LobbyContext } from '../lobby-context.type';
import type { LobbyPatch } from '../lobby-service.type';
import { EDITABLE_PHASES } from './host.constants';

const updateLobby = async (ctx: LobbyContext, lobbyId: string, patch: LobbyPatch) => {
  const lobby = await ctx.book.commit(lobbyId, (draft) => {
    if (!EDITABLE_PHASES.includes(draft.phase)) throw new Error(`the lobby is ${draft.phase} and cannot change`);
    if (patch.name !== undefined) draft.name = patch.name;
    draft.options = { ...draft.options, ...patch.options };
  });
  ctx.publish(lobby);
  return lobby;
};

export { updateLobby };
