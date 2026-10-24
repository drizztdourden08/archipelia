/* @layer tests @kind test */
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { Hello, ServerMessage } from '@archipelia/lobby-protocol';
import { createScenarioKit } from '@archipelia/lobby-protocol/testing';
import type { Session, SessionTemplate } from '@archipelia/model';
import type { LobbyRun } from '@archipelia/sessions';
import { createLobbyService } from '../../src/lobby/create-lobby-service';
import type { LobbyLink, LobbyTrust } from '../../src/lobby/lobby-service.type';
import { createLobbyStore } from '../../src/lobby/store/create-lobby-store';
import { createNodeDomains } from '../../src/node';
import { fakeTrust, testDeps } from './test-deps';

type KitOptions = { trust?: LobbyTrust; run?: (template: SessionTemplate, lobby: LobbyRun) => Promise<Session> };

const kit = createScenarioKit();

const fileOf = (name: string) => {
  const file = kit.files.find((entry) => entry.name === name);
  if (!file) throw new Error(`the kit has no ${name}`);
  return file;
};

const helloOf = (patch: Partial<Hello> = {}): Hello => {
  const world = fileOf('W');
  const yaml = fileOf('Y');
  return {
    type: 'hello', seq: 1, protocol: { name: 'archipelia-lobby', versions: [1] }, lobby: { code: 'K7QM-4XT2' }, resume: null,
    client: { id: 'relic-of-the-past', name: 'Relic of the Past', version: '0.22.0', platform: { os: 'windows', arch: 'x64' } },
    player: { displayName: 'Link' }, archipelago: { version: '0.6.8' }, capabilities: ['slots.yaml', 'worlds.upload'],
    worlds: [{ game: 'Relic of the Past', module: 'relic_of_the_past', worldVersion: '0.1.0', sha256: world.sha256, size: world.bytes.length, proof: { method: 'github-attestation', bundle: {} } }],
    slots: [{ name: 'Link', game: 'Relic of the Past', yaml: { sha256: yaml.sha256, size: yaml.bytes.length } }],
    ...patch,
  };
};

const linkOf = () => {
  const sent: ServerMessage[] = [];
  const closed: number[] = [];
  const link: LobbyLink = { send: (message) => sent.push(message), close: (code) => closed.push(code) };
  return { link, sent, closed };
};

const neverRuns = () => Promise.reject(new Error('no run in this test'));

const startService = async (options: KitOptions = {}) => {
  const dataDir = await mkdtemp(join(tmpdir(), 'archipelia-security-'));
  const domains = createNodeDomains(dataDir);
  const store = createLobbyStore(domains.domain('lobbies'));
  const trust = options.trust ?? fakeTrust('active');
  const service = createLobbyService(testDeps({ store, output: domains.domain('sessions'), root: dataDir, trust, run: options.run ?? neverRuns }));
  const stop = () => rm(dataDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  return { service, store, dataDir, domains, stop };
};

const engine = { id: 'ap-0.6.8', ap: '0.6.8', python: '3.12.0' };

const holdFiles = async (store: ReturnType<typeof createLobbyStore>, lobbyId: string, names: string[]) => {
  for (const name of names) await store.writeFile(lobbyId, fileOf(name).sha256, fileOf(name).bytes);
};

export { engine, fileOf, helloOf, holdFiles, linkOf, startService };
