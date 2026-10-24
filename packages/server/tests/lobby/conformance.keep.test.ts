/* @layer tests @kind test */
import { afterEach, describe, expect, test } from 'vitest';
import type { Bindings, HostLine, JsonValue, ScenarioKit, Transport } from '@drizztdourden08/archipelia-lobby-protocol/testing';
import { connectWebSocket, createFakeClient, loadScenario, SCENARIO_CATALOG } from '@drizztdourden08/archipelia-lobby-protocol/testing';
import type { Lobby } from '@archipelia/model';
import { kitFor } from './conformance-kit';
import type { ConformanceServer } from './conformance-server';
import { prepareLobby, startConformanceServer } from './conformance-server';

const DRAIN_MS = 150;

const connectDrained = async (url: string): Promise<Transport> => {
  await new Promise((resolve) => setTimeout(resolve, DRAIN_MS));
  const transport = await connectWebSocket(url);
  return { ...transport, close: (code) => void setTimeout(() => transport.close(code), DRAIN_MS) };
};

let running: ConformanceServer | undefined;

afterEach(async () => {
  await running?.stop();
  running = undefined;
});

const fill = (value: JsonValue, bindings: Bindings): JsonValue => {
  if (typeof value === 'string' && value.startsWith('$')) return bindings[value.slice(1)] ?? value;
  if (Array.isArray(value)) return value.map((item) => fill(item, bindings));
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, fill(item, bindings)]));
  return value;
};

const takeOver = async (server: ConformanceServer, name: string, bindings: Bindings) => {
  const first = loadScenario(name).lines.find((line) => line.dir === 'c2s' && 'msg' in line && line.msg.type === 'hello');
  if (!first || !('msg' in first)) throw new Error('the scenario has no hello');
  const second = await connectWebSocket(server.url);
  const welcomed = new Promise<void>((resolve) => second.listen((event) => {
    if (event.kind === 'text' && event.text.includes('"welcome"')) resolve();
  }));
  second.send(JSON.stringify({ ...(fill(first.msg, bindings) as Record<string, JsonValue>), resume: bindings.token ?? null }));
  await welcomed;
};

const seedFiles = async (server: ConformanceServer, lobby: Lobby, kit: ScenarioKit) => {
  for (const file of kit.files.filter((entry) => entry.name === 'W' || entry.name === 'Y')) await server.store.writeFile(lobby.id, file.sha256, file.bytes);
};

const hostHook = (server: ConformanceServer, lobby: Lobby, name: string, kit: ScenarioKit) => async (line: HostLine, bindings: Bindings) => {
  const member = String(bindings.member);
  const { service } = server;
  if (line.action === 'approve') await service.approve(lobby.id, member);
  else if (line.action === 'refuse') await service.refuse(lobby.id, member, String(line.reason));
  else if (line.action === 'lock') await service.lock(lobby.id);
  else if (line.action === 'consent') await service.consent(lobby.id, String(line.world), line.allowed === true);
  else if (line.action === 'takeover') await takeOver(server, name, bindings);
  else if (line.action === 'start') {
    await (await service.start(lobby.id)).finished;
  }
};

describe('the real lobby server against the fake client', () => {
  test.each(SCENARIO_CATALOG.map((entry) => entry.name))('%s', async (name) => {
    const entry = SCENARIO_CATALOG.find((candidate) => candidate.name === name);
    if (!entry) throw new Error(`no catalog entry for ${name}`);
    running = await startConformanceServer(name, entry.setup);
    const lobby = await prepareLobby(running, entry.setup);
    const kit = kitFor(name);
    const server = running;
    if (entry.setup.heldFiles) await seedFiles(server, lobby, kit);
    const client = createFakeClient({
      scenario: loadScenario(name), kit, ignore: ['lobby.state'], timeoutMs: 8000,
      connect: () => connectDrained(server.url), host: hostHook(server, lobby, name, kit),
    });
    const result = await client.play();
    expect(result.failure).toBeUndefined();
    expect(result.ok).toBe(true);
  }, 30000);
});
