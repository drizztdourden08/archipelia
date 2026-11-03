/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { SCENARIO_CATALOG, checkFixtureSchemas, loadScenario, runScenario } from '../src/testing';

const NAMES = SCENARIO_CATALOG.map((entry) => entry.name);

describe('K2 conformance scenarios, fake client against fake server', { tags: ['standard'] }, () => {
  test.each(NAMES)('%s plays through on both sides', async (name) => {
    const run = await runScenario(loadScenario(name));
    expect({ client: run.client.failure, server: run.server.failure }).toEqual({
      client: undefined,
      server: undefined,
    });
    expect(run.client.ok && run.server.ok).toBe(true);
  });
});

describe('K2 fixtures', { tags: ['standard'] }, () => {
  test.each(NAMES)('%s validates against the schemas', (name) => {
    expect(checkFixtureSchemas(loadScenario(name))).toEqual([]);
  });
});
