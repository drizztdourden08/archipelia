/* @layer tests @kind test */
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { zipSync } from 'fflate';
import type { ScenarioSetup } from '@drizztdourden08/archipelia-lobby-protocol/testing';
import type { Lobby, Session, SessionTemplate } from '@archipelia/model';
import type { LobbyRun } from '@archipelia/sessions';
import { createLobbyService } from '../../src/lobby/create-lobby-service';
import type { LobbyStore } from '../../src/lobby/lobby-service.type';
import { createLobbyStore } from '../../src/lobby/store/create-lobby-store';
import { startListener } from '../../src/listener/start-listener';
import { createNodeDomains } from '../../src/node';
import { fakeTrust, testDeps } from '../../src/testing';

const faultyStore = (store: LobbyStore, armed: boolean): LobbyStore => {
  let fired = !armed;
  return {
    ...store,
    save: (lobby) => {
      if (!fired && lobby.members.some((member) => member.ready && member.kind === 'client')) {
        fired = true;
        return Promise.reject(new Error('the lobby store is not available'));
      }
      return store.save(lobby);
    },
  };
};

const outputZip = (setup: ScenarioSetup) => {
  const files: Record<string, Uint8Array> = { 'AP_1234.archipelago': new Uint8Array([1, 2, 3]) };
  if (setup.outputFile) files[`AP_1234_P1_${setup.outputFile.name}`] = new TextEncoder().encode(setup.outputFile.text);
  return zipSync(files);
};

const startConformanceServer = async (name: string, setup: ScenarioSetup) => {
  const dataDir = await mkdtemp(join(tmpdir(), 'archipelia-lobby-'));
  const domains = createNodeDomains(dataDir);
  const store = faultyStore(createLobbyStore(domains.domain('lobbies')), name === 'internal-error');
  const output = domains.domain('sessions');
  let runs = 0;
  const run = async (template: SessionTemplate, lobby: LobbyRun): Promise<Session> => {
    runs += 1;
    const base: Session = { id: `s${runs}`, snapshot: template, status: 'generating', createdAt: 0, lobbyId: lobby.lobbyId, worlds: lobby.worlds };
    if (name === 'start-failure' && runs === 1) return { ...base, status: 'failed', error: 'Generate.py exited with code 1' };
    await output.writeBytes(`${base.id}/output/AP_1234.zip`, outputZip(setup));
    service.onSessionEvent({ type: 'session', session: { ...base, status: 'starting' } });
    return { ...base, status: 'hosting', seed: '1234', output: { zip: 'AP_1234.zip', files: [], generateLog: '' }, endpoint: { host: 'archipelago.gg', port: 38281, roomUrl: 'https://archipelago.gg/room/test' } };
  };
  const trust = fakeTrust(setup.registry, name === 'trust-failed');
  const service = createLobbyService(testDeps({ store, output, root: dataDir, trust, run }));
  const listener = await startListener({
    service, host: '127.0.0.1', port: 0, serverVersion: '0.9.0',
    admin: { token: () => Promise.resolve('admin-test-token'), watch: () => () => undefined, engines: () => Promise.resolve([]) },
  });
  const stop = async () => {
    await listener.stop();
    await rm(dataDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  };
  return { service, store, listener, url: `ws://127.0.0.1:${listener.port}/archipelia/lobby`, stop };
};

type ConformanceServer = Awaited<ReturnType<typeof startConformanceServer>>;

const prepareLobby = async ({ service }: ConformanceServer, setup: ScenarioSetup): Promise<Lobby> => {
  const lobby = await service.create({
    name: setup.name,
    engine: { id: `ap-${setup.ap}`, ap: setup.ap, python: '3.12.0' },
    options: { admission: setup.admission, allowUnlisted: setup.allowUnlisted, maxSlots: setup.maxSlots, room: { kind: 'archipelago-gg' } },
  });
  if (setup.existingSlots.length > 0) {
    const slots = setup.existingSlots.map((slot) => ({ ...slot, yaml: `name: ${slot.name}\ngame: ${slot.game}\n` }));
    await service.addHost(lobby.id, { displayName: 'Host', slots });
  }
  if (setup.phase === 'locked') await service.lock(lobby.id);
  if (setup.phase === 'closed') await service.close(lobby.id);
  return lobby;
};

export { prepareLobby, startConformanceServer };
export type { ConformanceServer };
