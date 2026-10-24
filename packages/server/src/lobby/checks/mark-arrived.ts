/* @layer core @kind logic */
import type { Lobby } from '@archipelia/model';
import type { LobbyContext } from '../lobby-context.type';
import { arrivedSlots } from './arrived-slots';
import { setStates } from './set-states';
import { SETTLING_PHASES } from './settle-lobby.constants';

const markArrived = async (ctx: LobbyContext, lobbyId: string): Promise<Lobby | undefined> => {
  const lobby = await ctx.book.get(lobbyId);
  if (!lobby || !SETTLING_PHASES.includes(lobby.phase)) return undefined;
  const arrived = await arrivedSlots(ctx.deps.store, lobby);
  if (arrived.length === 0) return lobby;
  const marked = await ctx.book.commit(lobbyId, (draft) => setStates(draft, arrived));
  ctx.publish(marked);
  return marked;
};

export { markArrived };
