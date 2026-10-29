/* @layer tests @kind test */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { GithubLimitError } from '../src/source/github-limit-error';
import { fetchIndexTree } from '../src/fetch-tree';
import { readCatalog } from '../src/read-catalog';
import { textFiles } from './memory-files.fixtures';

const SOURCE = { owner: 'o', repo: 'r', ref: 'main' };
const RESET_S = Math.floor(Date.now() / 1000) + 600;
const blob = (path: string) => ({ path, type: 'blob', sha: `sha-${path}` });

const limited = (status: number) => new Response('{}', { status, headers: { 'x-ratelimit-remaining': '0', 'x-ratelimit-reset': String(RESET_S) } });

const github = (tree: () => Response) => vi.stubGlobal('fetch', (input: string) => {
  if (input.includes('/git/trees/')) return Promise.resolve(tree());
  if (input.endsWith('index.toml')) return Promise.resolve(new Response('archipelago_version = "0.6.7"\n'));
  if (input.endsWith('index.lock')) return Promise.resolve(new Response(''));
  return Promise.resolve(new Response('name = "alpha"\n'));
});

const whole = () => new Response(JSON.stringify({ truncated: false, tree: [blob('index.toml'), blob('index.lock'), blob('index/alpha.toml')] }));

afterEach(() => vi.unstubAllGlobals());

describe('GitHub limiting the index listing', () => {
  test.each([403, 429])('an HTTP %i is a limit with the reset time, not a failure', async (status) => {
    github(() => limited(status));
    const err = await fetchIndexTree(SOURCE).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(GithubLimitError);
    expect((err as GithubLimitError).resetAt).toBe(RESET_S * 1000);
  });

  test('a limited read gives the stored listing with the time it was listed and when to retry', async () => {
    const files = textFiles();
    github(whole);
    const fresh = await readCatalog({ files, cacheDir: 'c', source: SOURCE });
    expect(fresh.limited).toBeUndefined();
    github(() => limited(403));
    const stored = await readCatalog({ files, cacheDir: 'c', source: SOURCE });
    expect(stored.entries.map((e) => e.apworld)).toEqual(fresh.entries.map((e) => e.apworld));
    expect(stored.entries).toHaveLength(1);
    expect(stored.limited?.limitedUntil).toBe(RESET_S * 1000);
    expect(stored.limited?.listedAt).toBeLessThanOrEqual(Date.now());
  });

  test('with nothing stored the limit is still reported as a limit', async () => {
    github(() => limited(429));
    await expect(readCatalog({ files: textFiles(), cacheDir: 'c', source: SOURCE })).rejects.toBeInstanceOf(GithubLimitError);
  });

  test('a network failure or a timeout falls back to the stored listing', async () => {
    const files = textFiles();
    github(whole);
    await readCatalog({ files, cacheDir: 'c', source: SOURCE });
    github(() => { throw new DOMException('The operation was aborted due to timeout', 'TimeoutError'); });
    const stored = await readCatalog({ files, cacheDir: 'c', source: SOURCE });
    expect(stored.entries).toHaveLength(1);
    expect(stored.limited).toBeUndefined();
  });

  test('every index request carries a time limit', async () => {
    const signals: unknown[] = [];
    vi.stubGlobal('fetch', (input: string, init?: RequestInit) => {
      signals.push(init?.signal);
      if (input.includes('/git/trees/')) return Promise.resolve(whole());
      return Promise.resolve(new Response(input.endsWith('index.toml') ? 'archipelago_version = "0.6.7"\n' : ''));
    });
    await readCatalog({ files: textFiles(), cacheDir: 'c', source: SOURCE }).catch(() => undefined);
    expect(signals.length).toBeGreaterThan(1);
    expect(signals.every((signal) => signal instanceof AbortSignal)).toBe(true);
  });

  test('another HTTP failure stays a plain error', async () => {
    github(() => new Response('{}', { status: 500 }));
    await expect(fetchIndexTree(SOURCE)).rejects.toThrow('index tree: HTTP 500');
  });
});
