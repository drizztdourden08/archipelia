/* @layer tests @kind test */
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import type { ServerSettings } from '@archipelia/model';
import { createGgHost } from '../src';
import type { SessionHost } from '../src';
import { createFakeGgSite } from './fake-gg-site';

const server: ServerSettings = {
  hintCost: 10, releaseMode: 'auto', collectMode: 'auto', remainingMode: 'goal', autoShutdownMinutes: 0,
};

let dir = '';
let seedFile = '';

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), 'gg-host-'));
  seedFile = join(dir, 'AP_123.zip');
  await writeFile(seedFile, Buffer.from('PK fake seed'));
});

afterEach(() => rm(dir, { recursive: true, force: true }));

const hostFor = (site: ReturnType<typeof createFakeGgSite>) =>
  createGgHost({ ownerId: site.owner, baseUrl: site.base, pollMs: 5, stopTimeoutMs: 500, passwordTimeoutMs: 500, fetch: site.fetch });

const start = (host: SessionHost, password?: string) => host.start({ sessionId: 's1', sessionDir: dir, seedFile, server, password });

const logText = (host: SessionHost) => {
  const lines: string[] = [];
  host.onLog(({ text }) => lines.push(text))();
  return lines;
};

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('archipelago.gg host', () => {
  test('uploads the seed, opens a room and returns its port', async () => {
    const site = createFakeGgSite();
    const endpoint = await start(hostFor(site));
    expect(endpoint).toEqual({ host: 'gg.test', port: 38281, roomUrl: `${site.base}/room/${site.room}` });
    expect(site.uploads).toEqual([{ name: 'AP_123.zip', cookie: 'session=owner-cookie' }]);
    expect(site.commands).toEqual([]);
  });

  test('sets the password right after the room is made and waits for the room to confirm it', async () => {
    const site = createFakeGgSite();
    const host = hostFor(site);
    await start(host, "it's secret");
    expect(site.commands).toEqual([`/option password 'it'"'"'s secret'`]);
    await host.stop();
    const text = logText(host).join('\n');
    expect(text).toContain('Set option password to ***');
    expect(text).toContain('Hosting game at gg.test:38281');
    expect(text).not.toContain('secret');
  });

  test('a password that clears the option is refused before any upload', async () => {
    const site = createFakeGgSite();
    await expect(start(hostFor(site), 'None')).rejects.toThrow(/clears the password/);
    expect(site.uploads).toEqual([]);
  });

  test('commands go through the room form and stop sends /exit', async () => {
    const site = createFakeGgSite();
    const host = hostFor(site);
    await start(host);
    await host.command('/countdown 10');
    await host.stop();
    expect(site.commands).toEqual(['/countdown 10', '/exit']);
    expect(site.stopped).toBe(true);
    await expect(host.command('/players')).rejects.toThrow(/not running/);
  });

  test('a room that fails to start rejects and is told to exit', async () => {
    const site = createFakeGgSite({ failPort: true });
    await expect(start(hostFor(site))).rejects.toThrow(/failed to start/);
    expect(site.commands).toEqual(['/exit']);
  });

  test('the log is read by byte offset and split on complete lines only', async () => {
    const site = createFakeGgSite();
    const host = hostFor(site);
    await start(host);
    site.appendLog('[t]: half a li');
    await pause(30);
    site.appendLog('ne with é\n[t]: next\n');
    await pause(30);
    await host.stop();
    const lines = logText(host);
    expect(lines.filter((line) => line.includes('half'))).toEqual(['[t]: half a line with é']);
    expect(lines.filter((line) => line === '[t]: next')).toHaveLength(1);
  });
});
