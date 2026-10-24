/* @layer tests @kind test */
import { readdirSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import { PROTOCOL_VERSION } from '../src';
import { SCENARIO_CATALOG, checkFixtureSchemas, loadScenario, runScenario } from '../src/testing';
import { findFixturesDir } from '../src/testing/scenario/find-fixtures-dir';

const NAMES = SCENARIO_CATALOG.map((entry) => entry.name);

const versionsIn = (name: string): number[] =>
  loadScenario(name).lines.flatMap((line) => {
    if (line.dir !== 's2c') return [];
    const protocol = line.msg.protocol as { version?: number } | undefined;
    return protocol?.version === undefined ? [] : [protocol.version];
  });

describe('conformance scenarios, fake client against fake server', () => {
  test.each(NAMES)('%s plays through on both sides', async (name) => {
    const run = await runScenario(loadScenario(name));
    expect({ client: run.client.failure, server: run.server.failure }).toEqual({
      client: undefined,
      server: undefined,
    });
    expect(run.client.ok && run.server.ok).toBe(true);
  });
});

describe('fixtures', () => {
  test('the catalog and the fixture files name the same scenarios', () => {
    const files = readdirSync(findFixturesDir())
      .filter((file) => file.endsWith('.jsonl'))
      .map((file) => file.slice(0, -'.jsonl'.length))
      .sort();
    expect(files).toEqual([...NAMES].sort());
  });

  test.each(NAMES)('%s validates against the schemas', (name) => {
    expect(checkFixtureSchemas(loadScenario(name))).toEqual([]);
  });

  test('every welcome and lobby.info.reply in the fixtures carries the protocol constant', () => {
    const versions = NAMES.flatMap(versionsIn);
    expect(versions.length).toBeGreaterThan(0);
    expect(new Set(versions)).toEqual(new Set([PROTOCOL_VERSION]));
  });

  test('the RotP example exchange covers info, join, upload, approval, resume and start', () => {
    const lines = loadScenario('approval-join').lines;
    const flow = lines.map((line) => (line.dir === 'c2s' || line.dir === 's2c') && 'msg' in line ? String(line.msg.type) : line.dir);
    const order = ['lobby.info', 'hello', 'welcome', 'upload.begin', 'admission', 'ready', 'connect', 'hello', 'welcome', 'lobby.started', 'leave'];
    let cursor = 0;
    for (const step of order) {
      cursor = flow.indexOf(step, cursor) + 1;
      expect(cursor, `missing step ${step}`).toBeGreaterThan(0);
    }
  });
});
