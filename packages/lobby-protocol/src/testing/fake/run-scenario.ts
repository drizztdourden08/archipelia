/* @layer testing @kind logic */
import type { Scenario } from '../scenario/scenario.type';
import type { RunOptions, ScenarioRun } from './fake.type';
import { createMemoryPair } from '../transport/create-memory-pair';
import { createFakeClient } from './create-fake-client';
import { createFakeServer } from './create-fake-server';

const runScenario = async (scenario: Scenario, options: RunOptions = {}): Promise<ScenarioRun> => {
  const server = createFakeServer({ scenario, timeoutMs: options.timeoutMs });
  const client = createFakeClient({
    scenario: options.clientScenario ?? scenario,
    kit: options.kit,
    ignore: options.ignore,
    timeoutMs: options.timeoutMs,
    connect: () => {
      const [clientEnd, serverEnd] = createMemoryPair();
      server.attach(serverEnd);
      return Promise.resolve(clientEnd);
    },
  });
  const [clientResult, serverResult] = await Promise.all([client.play(), server.done]);
  return { client: clientResult, server: serverResult };
};

export { runScenario };
