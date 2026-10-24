/* @layer core @kind logic */
import type { Lobby, SessionPlayer, SessionTemplate } from '@archipelia/model';
import type { LobbyContext } from '../lobby-context.type';
import { roomPassword } from './room-password';
import type { Participant } from './start.type';

const playerOf = async (ctx: LobbyContext, lobby: Lobby, { slot }: Participant, index: number): Promise<SessionPlayer> => {
  const bytes = await ctx.deps.store.readFile(lobby.id, slot.yamlSha256);
  if (!bytes) throw new Error(`the YAML of ${slot.name} is missing`);
  return { slot: index + 1, name: slot.name, game: slot.game, source: { kind: 'yaml', fileName: `${slot.name}.yaml`, yaml: new TextDecoder().decode(bytes) } };
};

const lobbyTemplate = async (ctx: LobbyContext, lobby: Lobby, players: Participant[]): Promise<SessionTemplate> => ({
  id: `lobby-${lobby.id}`,
  name: lobby.name,
  players: await Promise.all(players.map((player, index) => playerOf(ctx, lobby, player, index))),
  generator: lobby.options.generator,
  server: { ...lobby.options.server, passwordRef: await roomPassword(ctx, lobby) },
  host: lobby.options.room,
  updatedAt: ctx.now(),
});

export { lobbyTemplate };
