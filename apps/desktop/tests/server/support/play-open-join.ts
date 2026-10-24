/* @layer tests @kind helper */
import type { JsonObject, JsonValue } from '@drizztdourden08/archipelia-lobby-protocol/testing';
import { connectWebSocket, createFakeClient, createScenarioKit, loadScenario } from '@drizztdourden08/archipelia-lobby-protocol/testing';
import { adminCall } from './admin-call';
import { DOMAIN } from '@archipelia/model';
import { createNodeDomains } from '@archipelia/server/node';
import { seedTrust } from '@archipelia/trust/testing';

const DRAIN_MS = 150;

const withCode = (code: string, value: JsonValue): JsonValue => {
  if (Array.isArray(value)) return value.map((item) => withCode(code, item));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, key === 'code' && typeof item === 'string' ? code : withCode(code, item)]));
  }
  return value;
};

const playOpenJoin = async (port: number, dataDir: string, token: string) => {
  const kit = createScenarioKit();
  const world = kit.files.find((file) => file.name === 'W');
  if (!world) throw new Error('the kit has no world');
  const proof = { method: 'github-attestation', bundle: await seedTrust(createNodeDomains(dataDir).domain(DOMAIN.cache), world.bytes) } as JsonValue;
  const created = await adminCall(`ws://127.0.0.1:${port}/archipelia/admin`, token, 'lobby.create', {
    name: 'Friday seed',
    engine: { id: 'ap-0.6.8', ap: '0.6.8', python: '3.12.0' },
    options: { admission: 'open', allowUnlisted: false, maxSlots: 16, room: { kind: 'archipelago-gg' } },
  });
  const code = String(created.result?.code ?? '');
  if (code === '') throw new Error(`the lobby was not created: ${JSON.stringify(created)}`);
  const scenario = loadScenario('open-join');
  const lines = scenario.lines.map((line) => (line.dir === 'c2s' && 'msg' in line ? { ...line, msg: withCode(code, line.msg) as JsonObject } : line));
  const client = createFakeClient({
    scenario: { ...scenario, lines }, kit: { ...kit, values: { ...kit.values, proof } }, ignore: ['lobby.state'], timeoutMs: 15000,
    connect: async () => {
      await new Promise((resolve) => setTimeout(resolve, DRAIN_MS));
      return connectWebSocket(`ws://127.0.0.1:${port}/archipelia/lobby`);
    },
  });
  return client.play();
};

export { playOpenJoin };
