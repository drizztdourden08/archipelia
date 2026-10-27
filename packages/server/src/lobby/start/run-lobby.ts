/* @layer core @kind logic */
import type { EngineRuntime, Lobby, WorldUpload } from '@archipelia/model';
import type { LobbyRun } from '@archipelia/sessions';
import { pythonHome } from '../../sandbox/python-home';
import type { LobbyContext } from '../lobby-context.type';
import type { OverlayWorld } from '../lobby-service.type';
import { OVERLAY_DIR } from '../lobby.constants';
import { GENERATE_DISK_BYTES, GENERATE_TIMEOUT_MS } from './start.constants';
import { failLobby } from './fail-lobby';
import { hostLobby } from './host-lobby';
import { lobbyTemplate } from './lobby-template';
import { participantWorlds } from './participant-worlds';
import { participants } from './participants';
import { runRecordOf } from './run-record-of';
import type { Participant } from './start.type';

const overlayWorlds = (ctx: LobbyContext, lobby: Lobby, owned: WorldUpload[]): Promise<OverlayWorld[]> =>
  Promise.all(owned.map(async ({ module, sha256 }) => {
    const bytes = await ctx.deps.store.readFile(lobby.id, sha256);
    if (!bytes) throw new Error(`the world ${module} is missing`);
    return { module, sha256, bytes };
  }));

const lobbyRun = async (ctx: LobbyContext, lobby: Lobby, engine: EngineRuntime, { owned, players }: { owned: WorldUpload[]; players: Participant[] }): Promise<LobbyRun> => {
  const worlds = await overlayWorlds(ctx, lobby, owned);
  const overlay = await ctx.deps.overlay({ lobbyId: lobby.id, dir: `${ctx.deps.store.dir(lobby.id)}/${OVERLAY_DIR}`, runtime: engine, worlds });
  const run = { lobbyId: lobby.id, worlds: owned.map(({ game, sha256 }) => ({ game, sha256 })), runtime: overlay, timeoutMs: GENERATE_TIMEOUT_MS, ...runRecordOf(lobby, players) };
  if (!owned.some((world) => world.trust.level === 'unlisted')) return run;
  const readOnly = [pythonHome(engine)];
  const sandbox = await ctx.deps.sandbox();
  return {
    ...run, hostRuntime: engine, disk: { bytes: GENERATE_DISK_BYTES, extraDirs: [overlay.root] },
    confine: (runDir) => sandbox.confine({ readOnly, readWrite: [overlay.root, runDir] }),
  };
};

const generateAndHost = async (ctx: LobbyContext, lobby: Lobby) => {
  const runtime = await ctx.deps.runner.runtimeFor(lobby.engine);
  if (!runtime) return failLobby(ctx, lobby.id, { stage: 'generate', message: `Archipelago ${lobby.engine.ap} is not installed on this server.` });
  const players = participants(lobby);
  const owned = await participantWorlds(ctx, lobby, players);
  const run = await lobbyRun(ctx, lobby, runtime, { owned, players });
  const template = await lobbyTemplate(ctx, lobby, players);
  const session = await ctx.deps.runner.run(template, run);
  if (session.status === 'hosting') return hostLobby(ctx, lobby.id, session, players);
  if (run.confine) await ctx.deps.store.removeDir(lobby.id, OVERLAY_DIR).catch(() => undefined);
  return failLobby(ctx, lobby.id, { stage: session.output ? 'host' : 'generate', message: session.error ?? 'The run stopped.' });
};

const runLobby = (ctx: LobbyContext, lobby: Lobby): Promise<Lobby> =>
  generateAndHost(ctx, lobby).catch((error: unknown) =>
    failLobby(ctx, lobby.id, { stage: 'generate', message: error instanceof Error ? error.message : String(error) }));

export { runLobby };
