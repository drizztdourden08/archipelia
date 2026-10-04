/* @layer tests @kind test */
import { access, mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { installOfficial, listInstalled, removeWorld } from '@archipelia/catalog';
import { apRoot, generate, readRuntime, spawnPython } from '@archipelia/engine';
import { createLocalHost, removeSessionSettings, writeSessionSettings } from '@archipelia/hosts';
import type { EngineRuntime } from '@archipelia/model';
import { waitFor } from './support/ap-player';
import { ENGINE_DIR } from './support/e2e-inputs';
import { required } from './support/required';
import { dataFilesAt } from './support/temp-file-store';

type RoomInfo = { cmd: string; password: boolean };

const SERVER = { hintCost: 10, releaseMode: 'auto', collectMode: 'auto', remainingMode: 'goal', autoShutdownMinutes: 0 } as const;

const isRoomInfo = (value: unknown): value is RoomInfo =>
  typeof value === 'object' && value !== null && 'cmd' in value && 'password' in value;

const roomInfo = async (port: number) => {
  const ws = new WebSocket(`ws://127.0.0.1:${port}`);
  const first = await new Promise<string>((resolve) => { ws.onmessage = (event) => resolve(String(event.data)); });
  ws.close();
  const packets: unknown = JSON.parse(first);
  const info: unknown = Array.isArray(packets) ? packets[0] : undefined;
  if (!isRoomInfo(info)) throw new Error(`the server did not open with RoomInfo: ${first}`);
  return info;
};

const hostingSeen = (lines: string[]) => lines.some((line) => line.includes('Hosting game at'));

describe('room passwords never travel on a command line', () => {
  const state: { dir: string; runtime?: EngineRuntime } = { dir: '' };

  beforeAll(async () => {
    state.dir = await mkdtemp(join(tmpdir(), 'archipelia-pw-'));
    state.runtime = await readRuntime(ENGINE_DIR);
    await installOfficial({ engineDir: ENGINE_DIR, files: dataFilesAt(join(state.dir, 'games')), apworld: 'timespinner' });
    await mkdir(join(state.dir, 'players'));
    await writeFile(join(state.dir, 'players', 'p1.yaml'), 'name: Lunais\ngame: Timespinner\nTimespinner: {}\n');
  });

  afterAll(async () => {
    const files = dataFilesAt(join(state.dir, 'games'));
    for (const game of await listInstalled(files)) await removeWorld({ engineDir: ENGINE_DIR, files, apworld: game.apworld });
  });

  test('a local host reads the password from a session file it then deletes', async () => {
    const runtime = required(state.runtime, 'the engine runtime');
    const gen = await generate({ runtime, playersDir: join(state.dir, 'players'), outDir: join(state.dir, 'local'), spoiler: 1 });
    const host = createLocalHost({ runtime, port: 38293, bindHost: '127.0.0.1', advertiseHost: '127.0.0.1' });
    const seedFile = required(gen.zip, 'the generated seed');
    await host.start({ sessionId: 'pw', sessionDir: state.dir, seedFile, server: SERVER, password: 'local-secret' });
    const removed = await access(join(state.dir, 'host.yaml')).then(() => false, () => true);
    const info = await roomInfo(38293);
    await host.stop();
    expect(info.password).toBe(true);
    expect(removed).toBe(true);
  });

  test('an archipelago.gg seed carries its password inside the multidata', async () => {
    const runtime = required(state.runtime, 'the engine runtime');
    await writeSessionSettings(state.dir, 'baked-secret');
    const gen = await generate({ runtime, playersDir: join(state.dir, 'players'), outDir: join(state.dir, 'gg'), spoiler: 1, settingsDir: state.dir });
    await removeSessionSettings(state.dir);
    const lines: string[] = [];
    const args = [runtime.multiServer, required(gen.zip, 'the generated seed'), '--host', '127.0.0.1', '--port', '38294', '--use_embedded_options'];
    const server = spawnPython(runtime, { args, cwd: apRoot(runtime), keepStdin: true, onLine: (line) => lines.push(line) });
    await waitFor(() => hostingSeen(lines), 30000, 'the embedded-options server');
    const info = await roomInfo(38294);
    server.stdin?.write('/exit\n');
    await new Promise((resolve) => server.once('exit', resolve));
    expect(info.password).toBe(true);
  });
});
