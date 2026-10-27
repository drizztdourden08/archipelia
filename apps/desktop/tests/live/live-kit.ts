/* @layer tests @kind helper */
import { afterEach, vi } from 'vitest';
import { startLobbyRig } from '@archipelia/server/testing';
import type { AdminLobby, InstalledGame, SessionPlayer, SessionTemplate } from '@archipelia/model';
import { createLiveService } from '../../electron/live/create-live-service';
import { createLiveSessions } from '../../electron/live/create-live-sessions';
import type { LiveServiceDeps } from '../../electron/live/live.type';
import { openToNetwork } from '../../electron/sessions/open-to-network';
import { prepareRun } from '../../electron/sessions/prepare-run';
import type { LobbyRequest, LobbyServerStatus, PendingClose } from '../../src/lobbies/lobbies.type';
import type { LiveTab } from '../../src/live/live.type';
import { newTemplate } from '../../src/views/SessionBuilder/behavior/new-template';
import { tempFiles } from '../lobbies/temp-files';

type Rig = Awaited<ReturnType<typeof startLobbyRig>>;

const ENGINE = { id: 'ap-0.6.8', ap: '0.6.8', python: '3.12.0' };

const LTTP = 'A Link to the Past';

const GAME = {
  apworld: 'alttp', game: LTTP, version: '1.0.0', source: 'index', installedAt: 0, sha256: '', verified: false, layout: 'apworld', path: 'worlds/alttp.apworld', requires: [],
  schema: { game: LTTP, worldVersion: '1.0.0', groups: [], presets: {}, options: [] },
} satisfies InstalledGame;

const playerOf = (slot: number, name: string): SessionPlayer =>
  ({ slot, name, game: LTTP, source: { kind: 'yaml', fileName: `${name}.yaml`, yaml: `name: ${name}\ngame: ${LTTP}\n` } });

const sessionOf = (patch: Partial<SessionTemplate> = {}): SessionTemplate => ({
  ...newTemplate('t1'), name: 'Friday seed', host: { kind: 'local', port: 38281 }, players: [playerOf(1, 'Ana')], ...patch,
});

const networkOf = (consent: boolean) => {
  const state: { options: LobbyServerStatus['options'] } = { options: { mode: 'off', publicLookup: true, ...(consent ? { lanConsent: true } : {}) } };
  const apply = vi.fn((options: unknown) => {
    state.options = options as LobbyServerStatus['options'];
    return Promise.resolve();
  });
  const status = (): LobbyServerStatus => ({ state: 'listening', options: state.options, automation: false, roomPasswords: 'vault', lanAddress: '192.168.1.5' });
  const revoke = () => { state.options = { ...state.options, lanConsent: false }; };
  return { server: { status, apply }, apply, revoke };
};

const actOn = (on: Rig) => async (request: LobbyRequest) => {
  const params = request.type === 'lobby.create' ? { ...request.params, engine: ENGINE } : request.params;
  return (await on.call(request.type, params)) as AdminLobby;
};

const listOn = (on: Rig) => async () => (await on.call('lobby.list')) as AdminLobby[];

type KitOptions = { saved?: SessionTemplate[]; consent?: boolean; lobbies?: LiveServiceDeps['lobbies'] };

const liveKit = async (on: Rig, options: KitOptions = {}) => {
  const files = await tempFiles('server');
  const events: LiveTab[][] = [];
  const store = createLiveSessions({ files: files.files, emit: (tabs) => events.push(tabs) });
  const saved = new Map((options.saved ?? [sessionOf()]).map((template) => [template.id, template]));
  const templates = {
    get: (id: string) => Promise.resolve(saved.get(id) ?? null),
    list: () => Promise.resolve([...saved.values()]),
    save: (template: SessionTemplate) => {
      saved.set(template.id, template);
      return Promise.resolve(template);
    },
  };
  const network = networkOf(options.consent ?? true);
  const closed: PendingClose[] = [];
  const sharePassword = vi.fn(() => Promise.resolve());
  const setLanRoom = vi.fn();
  const sent: LobbyRequest[] = [];
  const act = (request: LobbyRequest) => { sent.push(request); return actOn(on)(request); };
  const cancelRun = vi.fn(() => Promise.resolve());
  const deps: LiveServiceDeps = {
    store, templates, cancelRun,
    library: () => Promise.resolve({ installed: [GAME], presets: [] }),
    lobbies: options.lobbies ?? (() => Promise.resolve({ act, list: listOn(on) })),
    slotOf: (player) => Promise.resolve({ name: player.name, game: player.game, yaml: player.source.kind === 'yaml' ? player.source.yaml : '', worldVersion: '1.0.0' }),
    beforeOpen: openToNetwork(network.server),
    beforeRun: prepareRun({ server: network.server, setLanRoom, sharePassword }),
    closer: { close: (ref) => { closed.push(ref); return Promise.resolve({ closed: true }); } },
  };
  return { deps, live: createLiveService(deps), store, files, saved, events, network, closed, sharePassword, sent, cancelRun };
};

const liveSuite = () => {
  let rig: Rig | undefined;
  const cleanups: (() => unknown)[] = [];
  const stopRig = async () => {
    await rig?.stop();
    rig = undefined;
  };
  afterEach(async () => {
    for (const cleanup of cleanups.splice(0)) await cleanup();
    await stopRig();
  });
  const kitOn = async (options: KitOptions = {}) => {
    rig = await startLobbyRig();
    const kit = await liveKit(rig, options);
    cleanups.push(kit.files.remove);
    return { ...kit, rig };
  };
  return { kitOn, cleanups, stopRig };
};

export { actOn, listOn, liveSuite, playerOf, sessionOf };
export type { Rig };
