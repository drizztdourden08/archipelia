/* @layer core @kind logic */
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { zipSync } from 'fflate';
import type { Session, SessionTemplate } from '@archipelia/model';
import type { LobbyRun } from '@archipelia/sessions';
import { adminHandlers } from '../listener/admin/admin-handlers';
import type { AdminDeps } from '../listener/listener.type';
import { startListener } from '../listener/start-listener';
import { createLobbyService } from '../lobby/create-lobby-service';
import { createLobbyStore } from '../lobby/store/create-lobby-store';
import { createNodeDomains } from '../node';
import { fakeTrust } from './fake-trust';
import { testDeps } from './test-deps';
import { RIG_HOST, RIG_ROOM, RIG_SEED, RIG_TOKEN, RIG_VERSION, RIG_ZIP } from './testing.constants';

const startLobbyRig = async () => {
  const dataDir = await mkdtemp(join(tmpdir(), 'archipelia-rig-'));
  const domains = createNodeDomains(dataDir);
  const output = domains.domain('sessions');
  const templates: SessionTemplate[] = [];
  const lobbyRuns: LobbyRun[] = [];
  const run = async (template: SessionTemplate, lobby: LobbyRun): Promise<Session> => {
    templates.push(template);
    lobbyRuns.push(lobby);
    const id = `rig-${templates.length}`;
    await output.writeBytes(`${id}/output/${RIG_ZIP}`, zipSync({ 'AP_1234.archipelago': new Uint8Array([1]) }));
    const generating: Session = { id, snapshot: template, status: 'generating', createdAt: 0, lobbyId: lobby.lobbyId, worlds: lobby.worlds };
    service.onSessionEvent({ type: 'session', session: { ...generating, status: 'starting' } });
    return { ...generating, status: 'hosting', seed: RIG_SEED, output: { zip: RIG_ZIP, files: [], generateLog: '' }, endpoint: RIG_ROOM };
  };
  const service = createLobbyService(testDeps({ store: createLobbyStore(domains.domain('lobbies')), output, root: dataDir, trust: fakeTrust('active'), run }));
  const watch = () => () => undefined;
  const engines = () => Promise.resolve([]);
  const token = () => Promise.resolve(RIG_TOKEN);
  const listener = await startListener({ service, host: RIG_HOST, port: 0, serverVersion: RIG_VERSION, admin: { token, watch, engines } });
  const admin: AdminDeps = { service, token, watch, engines, sandbox: 'none', info: () => ({ name: 'Archipelia', version: RIG_VERSION, port: listener.port }) };
  const call = async (type: string, params: Record<string, unknown> = {}): Promise<unknown> => {
    const handler = adminHandlers[type];
    if (!handler) throw new Error(`The request ${type} is not known.`);
    return handler(admin, { ...params, type });
  };
  const stop = async () => {
    await listener.stop();
    await rm(dataDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  };
  return { service, call, templates, lobbyRuns, address: `${RIG_HOST}:${listener.port}`, stop };
};

export { startLobbyRig };
