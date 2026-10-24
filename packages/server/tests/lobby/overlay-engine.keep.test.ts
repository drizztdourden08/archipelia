/* @layer tests @kind test */
import { existsSync, readFileSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { generate } from '@archipelia/engine';
import { createLocalHost } from '@archipelia/hosts';
import type { EngineRuntime } from '@archipelia/model';
import { freePort } from '../../src/core/engine/smoke/free-port';
import { buildOverlay } from '../../src/lobby/overlay/build-overlay';
import { probeWorld, probeYaml } from './probe-world';

const ENGINE = process.env.ARCHIPELIA_TEST_ENGINE ?? '';

const runtimeAt = (dir: string): EngineRuntime => {
  const meta = JSON.parse(readFileSync(join(dir, 'engine.json'), 'utf8')) as Record<string, string>;
  const at = (key: string) => resolve(dir, meta[key] ?? '');
  return {
    id: 'probe', apVersion: meta.apVersion ?? '', apCommit: 'probe', pythonVersion: 'probe', root: dir,
    python: at('python'), generate: at('generate'), multiServer: at('multiServer'), schemaScript: at('schemaScript'),
  };
};

let work = '';

beforeAll(async () => {
  work = await mkdtemp(join(tmpdir(), 'archipelia-overlay-'));
  process.env.ARCHIPELIA_PROBE_DIR = join(work, 'markers');
  await mkdir(join(work, 'markers'), { recursive: true });
});

afterAll(async () => {
  delete process.env.ARCHIPELIA_PROBE_DIR;
  await rm(work, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
});

describe.runIf(ENGINE !== '' && existsSync(join(ENGINE, 'engine.json')))('a lobby world overlay on a real engine', () => {
  test('Generate finds the world in custom_worlds of the overlay, and MultiServer imports it while it hosts', async () => {
    const engine = runtimeAt(ENGINE);
    const overlay = await buildOverlay({ lobbyId: 'probe', dir: join(work, 'overlay'), runtime: engine, worlds: [{ module: 'overlay_probe', sha256: 'probe', bytes: probeWorld() }] });
    expect(existsSync(join(ENGINE, 'ap', 'custom_worlds', 'overlay_probe.apworld'))).toBe(false);
    expect(existsSync(join(work, 'overlay', 'ap', 'custom_worlds', 'overlay_probe.apworld'))).toBe(true);
    const players = join(work, 'players');
    await mkdir(players, { recursive: true });
    await writeFile(join(players, 'P01.yaml'), probeYaml('Probe1'));
    await writeFile(join(players, 'P02.yaml'), probeYaml('Probe2'));
    const generated = await generate({ runtime: overlay, playersDir: players, outDir: join(work, 'output'), spoiler: 0 });
    expect(generated.lines.join('\n')).not.toContain('Traceback');
    expect({ ok: generated.ok, zip: Boolean(generated.zip) }).toEqual({ ok: true, zip: true });
    expect(await readFile(join(work, 'markers', 'Generate.py.loaded'), 'utf8')).toContain(join('overlay', 'ap', 'custom_worlds'));
    const host = createLocalHost({ runtime: overlay, port: await freePort('127.0.0.1'), bindHost: '127.0.0.1', advertiseHost: '127.0.0.1' });
    const room = join(work, 'room');
    await mkdir(room, { recursive: true });
    const server = { hintCost: 10, releaseMode: 'goal', collectMode: 'goal', remainingMode: 'goal', autoShutdownMinutes: 0 } as const;
    const endpoint = await host.start({ sessionId: 'probe', sessionDir: room, seedFile: join(work, 'output', String(generated.zip).split(/[\\/]/).pop() ?? ''), server });
    await host.stop();
    expect(endpoint.port).toBeGreaterThan(0);
    expect(await readFile(join(work, 'markers', 'MultiServer.py.loaded'), 'utf8')).toContain(join('overlay', 'ap', 'custom_worlds'));
    expect(existsSync(join(ENGINE, 'ap', 'custom_worlds', 'overlay_probe.apworld'))).toBe(false);
  }, 240000);
});
