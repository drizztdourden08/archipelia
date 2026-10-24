/* @layer core @kind logic */
import { randomBytes } from 'node:crypto';
import type { Lobby } from '@archipelia/model';
import type { LobbyContext } from '../lobby-context.type';
import { ROOM_SECRET_PREFIX } from '../lobby.constants';
import { PASSWORD_BYTES } from './start.constants';

const roomPassword = async (ctx: LobbyContext, lobby: Lobby): Promise<string> => {
  if (lobby.options.server.passwordRef) return lobby.options.server.passwordRef;
  const name = `${ROOM_SECRET_PREFIX}${lobby.id}`;
  if (!(await ctx.deps.secrets.get(name))) await ctx.deps.secrets.set(name, randomBytes(PASSWORD_BYTES).toString('base64url'), `Room password of the lobby ${lobby.name}`);
  return name;
};

export { roomPassword };
