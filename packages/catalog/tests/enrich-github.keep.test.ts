/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { createEnricher } from '../src/enrich/create-enricher';
import { DAY_MS, NEGATIVE_TTL_MS, TTL_MS } from '../src/enrich/enrich.constants';
import { parseGithubHome } from '../src/enrich/parse-github-home';
import { cacheFiles, imageResponse, textResponse } from './enrich.fixtures';

const HOME = 'https://github.com/someone/ts-world';
const RAW = 'https://raw.githubusercontent.com/someone/ts-world';
const README_URL = `${RAW}/HEAD/README.md`;
const ART_URL = 'https://opengraph.githubassets.com/1/someone/ts-world';
const README = '# Timespinner\n\nA community world for Timespinner that shuffles every item across time.\n';

type Route = (init: RequestInit | undefined) => Response;

const fakeFetch = (routes: Record<string, Route>) => {
  const calls: { url: string; headers: Record<string, string> }[] = [];
  const fetchFn: typeof fetch = (input, init) => {
    const url = String(input);
    calls.push({ url, headers: { ...(init?.headers as Record<string, string> | undefined) } });
    const route = routes[url];
    return route ? Promise.resolve(route(init)) : Promise.reject(new Error(`offline: ${url}`));
  };
  return { fetchFn, calls };
};

const setup = (routes: Record<string, Route>, start = 1000) => {
  let clock = start;
  const net = fakeFetch(routes);
  const cache = cacheFiles();
  const enricher = createEnricher({
    cache, engineDir: () => Promise.resolve('engine'), fetch: net.fetchFn, now: () => clock,
    entryOf: ({ apworld }) => Promise.resolve({ game: apworld, home: HOME }),
  });
  return { ...net, cache, enricher, advance: (ms: number) => { clock += ms; } };
};

const ask = (enricher: ReturnType<typeof setup>['enricher']) => enricher.enrich({ apworld: 'ts_world', source: 'index' });

const gone = () => new Response('', { status: 404 });

describe('parseGithubHome', () => {
  test('accepts a repo page and refuses everything else', () => {
    expect(parseGithubHome('https://github.com/a/b')).toEqual({ owner: 'a', repo: 'b' });
    expect(parseGithubHome('https://github.com/a/b.git/')).toEqual({ owner: 'a', repo: 'b' });
    expect(parseGithubHome('https://github.com/a/b/tree/main/docs')).toEqual({ owner: 'a', repo: 'b' });
    expect(parseGithubHome('https://github.com/a')).toBeUndefined();
    expect(parseGithubHome('https://gitlab.com/a/b')).toBeUndefined();
    expect(parseGithubHome('http://github.com/a/b')).toBeUndefined();
    expect(parseGithubHome('https://github.com.evil.example/a/b')).toBeUndefined();
    expect(parseGithubHome('https://github.com/a/..')).toBeUndefined();
    expect(parseGithubHome('not a url')).toBeUndefined();
    expect(parseGithubHome(undefined)).toBeUndefined();
  });
});

describe('a community world on GitHub', () => {
  const ok = { [README_URL]: () => textResponse(README, { etag: '"v1"' }), [ART_URL]: () => imageResponse() };

  test('keeps the README as markdown and the preview image as a data uri', async () => {
    const found = await ask(setup(ok).enricher);
    expect(found?.markdown).toBe(README.trim());
    expect(found?.origin).toBe('github');
    expect(found?.art?.startsWith('data:image/png;base64,')).toBe(true);
  });

  test('falls back from the default branch to main and then master', async () => {
    const t = setup({
      [README_URL]: gone, [`${RAW}/HEAD/readme.md`]: gone, [`${RAW}/main/README.md`]: gone, [`${RAW}/main/readme.md`]: gone,
      [`${RAW}/master/README.md`]: () => textResponse(README), [ART_URL]: gone,
    });
    const found = await ask(t.enricher);
    expect(found?.markdown).toContain('community world');
    expect(found?.art).toBeUndefined();
  });

  test('a fresh cache answers without any request', async () => {
    const t = setup(ok);
    await ask(t.enricher);
    const before = t.calls.length;
    t.advance(TTL_MS - 1);
    expect((await ask(t.enricher))?.markdown).toContain('community world');
    expect(t.calls.length).toBe(before);
    expect([...t.cache.store.keys()]).toEqual(['enrich/ts_world.json']);
  });

  test('after the TTL it asks again with the ETag and keeps the cache on a 304', async () => {
    let status = 200;
    const t = setup({
      [README_URL]: (init) => (status === 304 && (init?.headers as Record<string, string>)['If-None-Match'] === '"v1"'
        ? new Response(null, { status: 304 }) : textResponse(README, { etag: '"v1"' })),
      [ART_URL]: () => imageResponse(),
    });
    await ask(t.enricher);
    status = 304;
    t.advance(TTL_MS + 1);
    const again = await ask(t.enricher);
    expect(again?.markdown).toContain('community world');
    expect(again?.art).toBeDefined();
    const last = t.calls[t.calls.length - 1];
    expect(last?.url).toBe(README_URL);
    expect(last?.headers['If-None-Match']).toBe('"v1"');
    t.advance(TTL_MS - 1);
    const count = t.calls.length;
    await ask(t.enricher);
    expect(t.calls.length).toBe(count);
  });

});

describe('a community world on GitHub, offline and edge cases', () => {
  test('offline with nothing cached shows no enrichment and does not retry at once', async () => {
    const t = setup({});
    expect(await ask(t.enricher)).toBeUndefined();
    const count = t.calls.length;
    expect(await ask(t.enricher)).toBeUndefined();
    expect(t.calls.length).toBe(count);
  });

  test('offline after the TTL still shows what was cached', async () => {
    let online = true;
    const t = setup({
      [README_URL]: () => {
        if (!online) throw new Error('offline');
        return textResponse(README);
      },
      [ART_URL]: () => imageResponse(),
    });
    await ask(t.enricher);
    online = false;
    t.advance(TTL_MS + 1);
    expect((await ask(t.enricher))?.markdown).toContain('community world');
  });

  test('a repo with no README is remembered for a day, not asked again', async () => {
    const t = setup({
      [README_URL]: gone, [`${RAW}/HEAD/readme.md`]: gone, [`${RAW}/main/README.md`]: gone, [`${RAW}/main/readme.md`]: gone,
      [`${RAW}/master/README.md`]: gone, [`${RAW}/master/readme.md`]: gone, [ART_URL]: gone,
    });
    expect(await ask(t.enricher)).toBeUndefined();
    const count = t.calls.length;
    t.advance(NEGATIVE_TTL_MS - DAY_MS / 2);
    expect(await ask(t.enricher)).toBeUndefined();
    expect(t.calls.length).toBe(count);
  });

  test('art that is not a small image is ignored', async () => {
    const svg = setup({ [README_URL]: () => textResponse(README), [ART_URL]: () => imageResponse(64, 'image/svg+xml') });
    expect((await ask(svg.enricher))?.art).toBeUndefined();
    const huge = setup({ [README_URL]: () => textResponse(README), [ART_URL]: () => imageResponse(900 * 1024) });
    expect((await ask(huge.enricher))?.art).toBeUndefined();
  });

  test('a world whose home is not a GitHub repo is never fetched', async () => {
    const net = fakeFetch({});
    const enricher = createEnricher({
      cache: cacheFiles(), engineDir: () => Promise.resolve('engine'), fetch: net.fetchFn,
      entryOf: () => Promise.resolve({ game: 'x', home: 'https://example.com/x' }),
    });
    expect(await enricher.enrich({ apworld: 'x', source: 'index' })).toBeUndefined();
    expect(net.calls).toEqual([]);
  });
});
