/* @layer core @kind logic */
import { randomBytes } from 'node:crypto';
import type { Lobby } from '@archipelia/model';
import type { LobbyContext } from '../lobby-context.type';
import type { CreateLobbyInput } from '../lobby-service.type';
import { LOBBY_ID_PREFIX, OPEN_TTL_MS } from '../lobby.constants';
import { lobbyOptions } from '../state/lobby-options';
import { newCode } from './new-code';
import { CODE_ATTEMPTS, LOBBY_ID_BYTES } from './host.constants';

const freeCode = async (ctx: LobbyContext): Promise<string> => {
  const taken = new Set((await ctx.book.list()).filter((lobby) => lobby.phase !== 'closed').map((lobby) => lobby.code));
  for (let attempt = 0; attempt < CODE_ATTEMPTS; attempt += 1) {
    const code = (ctx.deps.newCode ?? newCode)();
    if (!taken.has(code)) return code;
  }
  throw new Error('no free lobby code was found');
};

const createLobby = async (ctx: LobbyContext, input: CreateLobbyInput): Promise<Lobby> => {
  const engine = input.engine ?? (await ctx.deps.activeEngine());
  if (!engine) throw new Error('install an Archipelago engine before opening a lobby');
  const now = ctx.now();
  const lobby: Lobby = {
    id: `${LOBBY_ID_PREFIX}${randomBytes(LOBBY_ID_BYTES).toString('hex')}`, code: await freeCode(ctx), name: input.name, phase: 'open', rev: 1,
    engine, options: lobbyOptions(input.options), members: [], worlds: [], nextMember: 1, createdAt: now, closesAt: now + OPEN_TTL_MS,
  };
  const added = await ctx.book.add(lobby);
  ctx.publish(added);
  return added;
};

export { createLobby };
