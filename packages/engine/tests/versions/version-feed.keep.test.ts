/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import type { FeedCache } from '../../src';
import { ENGINE_DEFAULTS, parsePythonBuilds, parseReleases, readPythonRange, readVersionFeed } from '../../src';
import { fakeFetch } from './fake-fetch';
import { MODULE_UPDATE_0_6_8 } from './fixtures/module-update.fixtures';
import { PYTHON_LATEST, SHA256SUMS } from './fixtures/python-feed.fixtures';
import { RELEASES_LINK, RELEASES_PAGE_ONE, RELEASES_PAGE_TWO, RELEASES_URL_ONE, RELEASES_URL_TWO } from './fixtures/releases.fixtures';
import { memoryStore } from './memory-store';

const TARGET = 'win32-x64';
const NOW = Date.UTC(2026, 9, 23, 12, 0, 0);
const HOUR = 3_600_000;
const SUMS_URL = `${PYTHON_LATEST.asset_url_prefix}/SHA256SUMS`;
const LATEST_URL = 'https://raw.githubusercontent.com/astral-sh/python-build-standalone/latest-release/latest-release.json';

const onlineRoutes = () => ({
  [RELEASES_URL_ONE]: { json: RELEASES_PAGE_ONE, headers: { link: RELEASES_LINK, etag: 'W/"one"' } },
  [RELEASES_URL_TWO]: { json: RELEASES_PAGE_TWO },
  [LATEST_URL]: { json: PYTHON_LATEST },
  [SUMS_URL]: { text: SHA256SUMS },
});

const cacheAt = (fetchedAt: number): FeedCache => ({
  version: 1,
  fetchedAt,
  target: TARGET,
  etag: 'W/"one"',
  releases: parseReleases([...RELEASES_PAGE_ONE, ...RELEASES_PAGE_TWO]),
  pythonRelease: PYTHON_LATEST.tag,
  python: parsePythonBuilds(SHA256SUMS, PYTHON_LATEST.tag, TARGET),
  ranges: {},
});

const request = (overrides: Partial<Parameters<typeof readVersionFeed>[0]>) => ({
  fetch: fakeFetch(onlineRoutes()).fetch,
  store: memoryStore(),
  now: NOW,
  mode: 'auto' as const,
  target: TARGET,
  defaults: ENGINE_DEFAULTS,
  ...overrides,
});

describe('parseReleases', () => {
  test('keeps stable tags only, newest first', () => {
    const tags = parseReleases([...RELEASES_PAGE_ONE, ...RELEASES_PAGE_TWO]).map((release) => release.version);
    expect(tags).toEqual(['0.6.8', '0.6.7', '0.6.2', '0.6.1']);
  });

  test('carries the date and the notes link', () => {
    expect(parseReleases(RELEASES_PAGE_ONE)[0]).toEqual({
      version: '0.6.8',
      tag: '0.6.8',
      publishedAt: '2026-10-04T10:00:00Z',
      notesUrl: 'https://github.com/ArchipelagoMW/Archipelago/releases/tag/0.6.8',
    });
  });
});

describe('parsePythonBuilds', () => {
  const builds = parsePythonBuilds(SHA256SUMS, PYTHON_LATEST.tag, TARGET);

  test('keeps the newest build of each minor line for the target', () => {
    expect(builds.map((build) => build.version)).toEqual(['3.14.9', '3.13.17', '3.12.15', '3.11.17']);
  });

  test('drops alphas, stripped builds, other targets and other releases', () => {
    expect(builds.every((build) => build.file.endsWith('-install_only.tar.gz') && build.file.includes('windows-msvc'))).toBe(true);
    expect(builds.find((build) => build.version === '3.12.15')?.sha256).toBe('3'.repeat(64));
  });

  test('an unknown target gives nothing', () => {
    expect(parsePythonBuilds(SHA256SUMS, PYTHON_LATEST.tag, 'plan9-x64')).toEqual([]);
  });
});

describe('readVersionFeed', () => {
  test('a first read is fresh, follows the next link and fills the cache', async () => {
    const fake = fakeFetch(onlineRoutes());
    const store = memoryStore();
    const feed = await readVersionFeed(request({ fetch: fake.fetch, store }));
    expect(feed.state).toBe('fresh');
    expect(feed.checkedAt).toBe(NOW);
    expect(feed.releases.map((release) => release.version)).toEqual(['0.6.8', '0.6.7', '0.6.2']);
    expect(feed.python.map((build) => build.version)).toEqual(['3.14.9', '3.13.17', '3.12.15', '3.12.14', '3.11.17']);
    expect(fake.calls.map((call) => call.url)).toContain(RELEASES_URL_TWO);
    expect(store.current()?.etag).toBe('W/"one"');
  });

  test('the pinned Python joins the list when the feed lacks it', async () => {
    const feed = await readVersionFeed(request({}));
    const pinned = feed.python.find((build) => build.pinned);
    expect(pinned?.version).toBe(ENGINE_DEFAULTS.defaultPython[TARGET]?.version);
    expect(pinned?.sha256).toBe(ENGINE_DEFAULTS.defaultPython[TARGET]?.sha256);
  });

  test('a read inside the window is cached and makes no call', async () => {
    const fake = fakeFetch(onlineRoutes());
    const feed = await readVersionFeed(request({ fetch: fake.fetch, store: memoryStore(cacheAt(NOW - HOUR)) }));
    expect(feed.state).toBe('cached');
    expect(fake.calls).toHaveLength(0);
  });

  test('an old cache is revalidated with its ETag and a 304 only refreshes the time', async () => {
    const fake = fakeFetch({ ...onlineRoutes(), [RELEASES_URL_ONE]: { status: 304 } });
    const store = memoryStore(cacheAt(NOW - 7 * HOUR));
    const feed = await readVersionFeed(request({ fetch: fake.fetch, store }));
    expect(fake.calls[0]?.headers['if-none-match']).toBe('W/"one"');
    expect(feed.state).toBe('fresh');
    expect(store.current()?.fetchedAt).toBe(NOW);
    expect(feed.releases.map((release) => release.version)).toEqual(['0.6.8', '0.6.7', '0.6.2']);
  });

  test('check now inside one minute of the last check makes no call', async () => {
    const fake = fakeFetch(onlineRoutes());
    const feed = await readVersionFeed(request({ fetch: fake.fetch, store: memoryStore(cacheAt(NOW - 30_000)), mode: 'force' }));
    expect(feed.state).toBe('cached');
    expect(fake.calls).toHaveLength(0);
  });

  test('check now after a minute reads again even inside the window', async () => {
    const fake = fakeFetch(onlineRoutes());
    const feed = await readVersionFeed(request({ fetch: fake.fetch, store: memoryStore(cacheAt(NOW - 120_000)), mode: 'force' }));
    expect(feed.state).toBe('fresh');
    expect(fake.calls.length).toBeGreaterThan(0);
  });

});

describe('readVersionFeed failures', () => {
  test('a network failure keeps the cache and says offline', async () => {
    const fake = fakeFetch({ ...onlineRoutes(), [RELEASES_URL_ONE]: { fail: 'getaddrinfo ENOTFOUND' } });
    const store = memoryStore(cacheAt(NOW - 7 * HOUR));
    const feed = await readVersionFeed(request({ fetch: fake.fetch, store }));
    expect(feed.state).toBe('offline');
    expect(feed.error).toContain('ENOTFOUND');
    expect(feed.checkedAt).toBe(NOW - 7 * HOUR);
    expect(feed.releases).toHaveLength(3);
    expect(store.writes()).toBe(0);
  });

  test('nothing reachable and no cache is offline with empty lists but the pinned Python', async () => {
    const feed = await readVersionFeed(request({ fetch: fakeFetch({}).fetch }));
    expect(feed.state).toBe('offline');
    expect(feed.releases).toEqual([]);
    expect(feed.python.map((build) => build.pinned)).toEqual([true]);
  });

  test('an exhausted rate limit keeps the cache and reports the reset time', async () => {
    const reset = Math.floor(NOW / 1000) + 1800;
    const fake = fakeFetch({
      ...onlineRoutes(),
      [RELEASES_URL_ONE]: { status: 403, headers: { 'x-ratelimit-remaining': '0', 'x-ratelimit-reset': String(reset) } },
    });
    const feed = await readVersionFeed(request({ fetch: fake.fetch, store: memoryStore(cacheAt(NOW - 7 * HOUR)) }));
    expect(feed.state).toBe('rate-limited');
    expect(feed.retryAt).toBe(reset * 1000);
    expect(feed.releases).toHaveLength(3);
  });

  test('a 403 with calls left is a plain failure, not a rate limit', async () => {
    const fake = fakeFetch({ ...onlineRoutes(), [RELEASES_URL_ONE]: { status: 403, headers: { 'x-ratelimit-remaining': '12' } } });
    const feed = await readVersionFeed(request({ fetch: fake.fetch }));
    expect(feed.state).toBe('offline');
    expect(feed.error).toContain('HTTP 403');
  });

});

describe('readVersionFeed modes', () => {
  test('cache only mode never calls and says never without a cache', async () => {
    const fake = fakeFetch(onlineRoutes());
    const none = await readVersionFeed(request({ fetch: fake.fetch, mode: 'cache-only' }));
    const some = await readVersionFeed(request({ fetch: fake.fetch, mode: 'cache-only', store: memoryStore(cacheAt(NOW - 40 * HOUR)) }));
    expect(none.state).toBe('never');
    expect(some.state).toBe('cached');
    expect(fake.calls).toHaveLength(0);
  });

  test('a cache for another target is ignored', async () => {
    const other = { ...cacheAt(NOW - HOUR), target: 'linux-x64' };
    const feed = await readVersionFeed(request({ store: memoryStore(other) }));
    expect(feed.state).toBe('fresh');
  });
});

describe('readPythonRange', () => {
  const COMMIT = 'b'.repeat(40);
  const RAW = `https://raw.githubusercontent.com/ArchipelagoMW/Archipelago/${COMMIT}/ModuleUpdate.py`;

  test('reads ModuleUpdate.py once per commit and platform', async () => {
    const fake = fakeFetch({ [RAW]: { text: MODULE_UPDATE_0_6_8 } });
    const store = memoryStore(cacheAt(NOW));
    const ask = () => readPythonRange({ fetch: fake.fetch, store, commit: COMMIT, ap: '0.6.8', platform: 'win32', defaults: ENGINE_DEFAULTS });
    const first = await ask();
    const second = await ask();
    expect(first).toEqual({ min: '3.11.9', maxExclusive: '3.14.0', warnBelow: '3.11.13', source: 'declared' });
    expect(second).toEqual(first);
    expect(fake.calls).toHaveLength(1);
  });

  test('a missing file is an error the install can name', async () => {
    const ask = readPythonRange({ fetch: fakeFetch({}).fetch, store: memoryStore(), commit: COMMIT, ap: '0.6.8', platform: 'win32', defaults: ENGINE_DEFAULTS });
    await expect(ask).rejects.toThrow(/ModuleUpdate\.py: HTTP 404/);
  });
});
