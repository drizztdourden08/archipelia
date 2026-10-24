/* @layer core @kind logic */
import type { Lobby, WorldUpload } from '@archipelia/model';
import type { LobbyContext } from '../lobby-context.type';
import type { OverlayWorld } from '../lobby-service.type';
import { OVERLAY_DIR } from '../lobby.constants';
import { failLobby } from './fail-lobby';
import { hostLobby } from './host-lobby';
import { lobbyTemplate } from './lobby-template';
import { participantWorlds } from './participant-worlds';
import { participants } from './participants';

const overlayWorlds = (ctx: LobbyContext, lobby: Lobby, owned: WorldUpload[]): Promise<OverlayWorld[]> =>
  Promise.all(owned.map(async ({ module, sha256 }) => {
    const bytes = await ctx.deps.store.readFile(lobby.id, sha256);
    if (!bytes) throw new Error(`the world ${module} is missing`);
    return { module, sha256, bytes };
  }));

const generateAndHost = async (ctx: LobbyContext, lobby: Lobby) => {
  const runtime = await ctx.deps.runner.runtimeFor(lobby.engine);
  if (!runtime) return failLobby(ctx, lobby.id, { stage: 'generate', message: `Archipelago ${lobby.engine.ap} is not installed on this server.` });
  const players = participants(lobby);
  const owned = await participantWorlds(ctx, lobby, players);
  const worlds = await overlayWorlds(ctx, lobby, owned);
  const overlay = await ctx.deps.overlay({ lobbyId: lobby.id, dir: `${ctx.deps.store.dir(lobby.id)}/${OVERLAY_DIR}`, runtime, worlds });
  const template = await lobbyTemplate(ctx, lobby, players);
  const runWorlds = owned.map(({ game, sha256 }) => ({ game, sha256 }));
  const session = await ctx.deps.runner.run(template, { lobbyId: lobby.id, worlds: runWorlds, runtime: overlay });
  if (session.status === 'hosting') return hostLobby(ctx, lobby.id, session, players);
  return failLobby(ctx, lobby.id, { stage: session.output ? 'host' : 'generate', message: session.error ?? 'The run stopped.' });
};

const runLobby = (ctx: LobbyContext, lobby: Lobby): Promise<Lobby> =>
  generateAndHost(ctx, lobby).catch((error: unknown) =>
    failLobby(ctx, lobby.id, { stage: 'generate', message: error instanceof Error ? error.message : String(error) }));

export { runLobby };
