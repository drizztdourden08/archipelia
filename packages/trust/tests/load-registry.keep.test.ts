/* @layer tests @kind test */
import { describe, expect, test, vi } from 'vitest';
import { loadRegistry } from '../src/registry/load-registry';
import { memoryFiles } from './memory-files';

const HOUR = 3_600_000;

const remote = (extra = 'remote-client') => ({
  format: 1,
  clients: [
    {
      id: extra,
      name: 'Remote',
      homepage: 'https://example.com',
      games: ['Remote Game'],
      status: 'active',
      trust: {
        method: 'github-attestation',
        repo: 'owner/repo',
        workflow: '.github/workflows/release.yml',
        refs: ['refs/heads/main'],
        issuer: 'https://token.actions.githubusercontent.com',
      },
    },
  ],
  games: [],
});

const bodyOf = (body: unknown, status: number | undefined) => {
  if (status === 304) return null;
  return typeof body === 'string' ? body : JSON.stringify(body);
};

const reply = (body: unknown, init: ResponseInit = { status: 200, headers: { etag: '"v1"' } }) => (_url?: string | URL | Request, _init?: RequestInit) =>
  Promise.resolve(new Response(bodyOf(body, init.status), init));

const ids = (load: Awaited<ReturnType<typeof loadRegistry>>) => load.registry.clients.map((client) => client.id);

describe('loadRegistry', () => {
  test('reads the network and caches the file with its etag', async () => {
    const files = memoryFiles();
    const fetchFn = vi.fn(reply(remote()));
    const load = await loadRegistry({ files, fetch: fetchFn, now: () => 1000 });
    expect(load).toMatchObject({ source: 'network', fetchedAt: 1000, problems: [] });
    expect(ids(load)).toEqual(['remote-client']);
    expect(files.store.get('registry.json')).toMatchObject({ etag: '"v1"', fetchedAt: 1000 });
  });

  test('serves the cache while it is fresh, with no request', async () => {
    const files = memoryFiles();
    await loadRegistry({ files, fetch: reply(remote()), now: () => 1000 });
    const fetchFn = vi.fn();
    const load = await loadRegistry({ files, fetch: fetchFn, now: () => 1000 + 5 * HOUR });
    expect(load.source).toBe('cache');
    expect(fetchFn).not.toHaveBeenCalled();
  });

  test('asks again after six hours with If-None-Match and keeps the cache on a 304', async () => {
    const files = memoryFiles();
    await loadRegistry({ files, fetch: reply(remote()), now: () => 1000 });
    const fetchFn = vi.fn(reply('', { status: 304 }));
    const load = await loadRegistry({ files, fetch: fetchFn, now: () => 1000 + 7 * HOUR });
    expect(fetchFn.mock.calls[0]?.[1]).toMatchObject({ headers: { 'if-none-match': '"v1"' } });
    expect(load).toMatchObject({ source: 'network', fetchedAt: 1000 + 7 * HOUR });
    expect(ids(load)).toEqual(['remote-client']);
    expect(files.store.get('registry.json')).toMatchObject({ etag: '"v1"', fetchedAt: 1000 + 7 * HOUR });
  });

  test('force asks at once', async () => {
    const files = memoryFiles();
    await loadRegistry({ files, fetch: reply(remote()), now: () => 1000 });
    const fetchFn = vi.fn(reply(remote('newer'), { status: 200, headers: { etag: '"v2"' } }));
    const load = await loadRegistry({ files, fetch: fetchFn, now: () => 2000 }, { force: true });
    expect(ids(load)).toEqual(['newer']);
  });

});

describe('loadRegistry fallbacks', () => {
  test('falls back to the stale cache when offline', async () => {
    const files = memoryFiles();
    await loadRegistry({ files, fetch: reply(remote()), now: () => 1000 });
    const load = await loadRegistry({ files, fetch: () => Promise.reject(new Error('offline')), now: () => 1000 + 30 * HOUR });
    expect(load).toMatchObject({ source: 'cache', fetchedAt: 1000, problems: ['offline'] });
    expect(ids(load)).toEqual(['remote-client']);
  });

  test('falls back to the bundled floor when offline with no cache', async () => {
    const load = await loadRegistry({ files: memoryFiles(), fetch: () => Promise.reject(new Error('offline')) });
    expect(load).toMatchObject({ source: 'floor', fetchedAt: null, problems: ['offline'] });
    expect(ids(load)).toContain('relic-of-the-past');
  });

  test('keeps the cache when the network sends an invalid file', async () => {
    const files = memoryFiles();
    await loadRegistry({ files, fetch: reply(remote()), now: () => 1000 });
    const load = await loadRegistry({ files, fetch: reply({ format: 9 }), now: () => 1000 + 8 * HOUR });
    expect(load.source).toBe('cache');
    expect(load.problems).toHaveLength(1);
    expect(files.store.get('registry.json')).toMatchObject({ fetchedAt: 1000 });
  });

  test.each([
    ['an HTTP error', reply('nope', { status: 500 })],
    ['text that is not JSON', reply('<html>')],
    ['an oversized file', reply(' '.repeat(1_000_001))],
  ])('uses the floor on %s with no cache', async (_name, fetchFn) => {
    const load = await loadRegistry({ files: memoryFiles(), fetch: fetchFn });
    expect(load.source).toBe('floor');
    expect(load.problems).toHaveLength(1);
  });

  test('ignores a damaged cache file', async () => {
    const files = memoryFiles();
    files.store.set('registry.json', { etag: null, fetchedAt: 1, registry: { format: 3 } });
    const load = await loadRegistry({ files, fetch: reply(remote()), now: () => 5 });
    expect(load.source).toBe('network');
  });
});
