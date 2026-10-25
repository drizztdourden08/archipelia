/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { createEnricher } from '../src/enrich/create-enricher';
import { MAX_PARALLEL } from '../src/enrich/enrich.constants';
import { createLimiter } from '../src/enrich/create-limiter';
import { cacheFiles, imageResponse, textResponse } from './enrich.fixtures';

const WORLDS = Array.from({ length: 12 }, (_, index) => `world_${index}`);

const slowFetch = () => {
  const state = { active: 0, peak: 0, urls: [] as string[] };
  const fetchFn: typeof fetch = async (input) => {
    const url = String(input);
    state.urls.push(url);
    state.active += 1;
    state.peak = Math.max(state.peak, state.active);
    await new Promise((resolve) => { setTimeout(resolve, 5); });
    state.active -= 1;
    return url.includes('opengraph') ? imageResponse() : textResponse('# Title\n\nA description that is long enough to count here.\n');
  };
  return { state, fetchFn };
};

const enricherOn = (fetchFn: typeof fetch) => createEnricher({
  cache: cacheFiles(), engineDir: () => Promise.resolve('engine'), fetch: fetchFn,
  entryOf: ({ apworld }) => Promise.resolve({ game: apworld, home: `https://github.com/owner/${apworld}` }),
});

describe('the limit on fetching', () => {
  test('a limiter runs at most the given number of tasks at once', async () => {
    const limit = createLimiter(2);
    const state = { active: 0, peak: 0 };
    const task = async () => {
      state.active += 1;
      state.peak = Math.max(state.peak, state.active);
      await new Promise((resolve) => { setTimeout(resolve, 2); });
      state.active -= 1;
    };
    await Promise.all(Array.from({ length: 8 }, () => limit(task)));
    expect(state.peak).toBe(2);
  });

  test('eight visible cards of twelve fetch at most three at a time, and only those cards are fetched', async () => {
    const net = slowFetch();
    const enricher = enricherOn(net.fetchFn);
    const found = await Promise.all(WORLDS.slice(0, 8).map((apworld) => enricher.enrich({ apworld, source: 'index' })));
    expect(found.every((entry) => entry?.summary !== undefined)).toBe(true);
    expect(net.state.peak).toBeLessThanOrEqual(MAX_PARALLEL);
    expect(net.state.peak).toBeGreaterThan(1);
    expect(net.state.urls.some((url) => url.includes('world_9'))).toBe(false);
    expect(new Set(net.state.urls.filter((url) => url.includes('raw.')).map((url) => url.split('/')[4])).size).toBe(8);
  });

  test('asking twice for the same world while it loads fetches once', async () => {
    const net = slowFetch();
    const enricher = enricherOn(net.fetchFn);
    await Promise.all([enricher.enrich({ apworld: 'one', source: 'index' }), enricher.enrich({ apworld: 'one', source: 'index' })]);
    expect(net.state.urls.filter((url) => url.includes('raw.')).length).toBe(1);
  });

  test('a world name that could leave the cache folder is refused', async () => {
    const enricher = createEnricher({ cache: cacheFiles(), engineDir: () => Promise.resolve('engine'), entryOf: () => Promise.reject(new Error('never asked')) });
    expect(await enricher.enrich({ apworld: '../evil', source: 'index' })).toBeUndefined();
  });
});
