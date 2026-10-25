/* @layer tests @kind test */
import { afterEach, describe, expect, test, vi } from 'vitest';
import type { DataFiles } from '@archipelia/model';
import { mergeCatalog } from '../src/first-party/merge-catalog';
import { readCatalog } from '../src/read-catalog';
import { communityEntry } from './first-party.fixtures';
import { memoryFiles } from './memory-files.fixtures';

const COUNT = 2500;
const NAMES = Array.from({ length: COUNT }, (_, i) => `game_${i}`);
const sha = (path: string) => `sha-${path}`;
const blob = (path: string) => ({ path, type: 'blob', sha: sha(path) });

const files = (): DataFiles => {
  const store = new Map<string, string>();
  return {
    ...memoryFiles([]),
    readText: (rel) => Promise.resolve(store.get(rel) ?? null),
    writeText: (rel, body) => { store.set(rel, body); return Promise.resolve(); },
  };
};

const reply = (body: unknown) => Promise.resolve(new Response(JSON.stringify(body)));
const text = (body: string) => Promise.resolve(new Response(body));

const raw = (path: string) => {
  if (path === 'index.toml') return text('archipelago_version = "0.6.7"\n');
  if (path === 'index.lock') return text('');
  return text(`name = "${path.slice(6, -5)}"\n`);
};

const fakeGithub = (truncate: boolean) => {
  const urls: string[] = [];
  const rootBlobs = [blob('index.toml'), blob('index.lock'), blob('README.md')];
  const dirs = [{ path: 'index', type: 'tree', sha: 'sha-index-dir' }, { path: 'apworlds', type: 'tree', sha: 'sha-apworlds' }];
  const entries = NAMES.map((name) => blob(`index/${name}.toml`));
  vi.stubGlobal('fetch', (input: string) => {
    urls.push(input);
    if (input.includes('/git/trees/main?recursive=1')) {
      return reply({ truncated: truncate, tree: truncate ? entries.slice(0, 1000) : [...rootBlobs, ...dirs, ...entries] });
    }
    if (input.endsWith('/git/trees/main')) return reply({ truncated: false, tree: [...rootBlobs, ...dirs] });
    if (input.endsWith('/git/trees/sha-index-dir')) return reply({ truncated: false, tree: entries.map((e) => ({ ...e, path: e.path.slice(6) })) });
    return raw(decodeURIComponent(input.replace('https://raw.githubusercontent.com/dowlle/Archipelago-index/main/', '')));
  });
  return urls;
};

afterEach(() => vi.unstubAllGlobals());

describe('a community index past 1000 entries', () => {
  test('reads every entry when the recursive tree is whole', async () => {
    fakeGithub(false);
    const catalog = await readCatalog({ files: files(), cacheDir: 'c' });
    expect(catalog.entries).toHaveLength(COUNT);
    expect(catalog.problems).toEqual([]);
  });

  test('walks the folders when GitHub truncates the recursive tree, so none are dropped', async () => {
    const urls = fakeGithub(true);
    const catalog = await readCatalog({ files: files(), cacheDir: 'c' });
    expect(catalog.entries).toHaveLength(COUNT);
    expect(new Set(catalog.entries.map((e) => e.apworld)).size).toBe(COUNT);
    expect(urls.some((url) => url.endsWith('/git/trees/sha-index-dir'))).toBe(true);
  });

  test('the first-party merge keeps all of them and adds its own', () => {
    const community = NAMES.map((name) => communityEntry(name));
    const mine = { ...communityEntry('relic_of_the_past'), source: 'first-party' as const };
    const merged = mergeCatalog(community, [mine]);
    expect(merged).toHaveLength(COUNT + 1);
    expect(merged.at(-1)?.apworld).toBe('relic_of_the_past');
  });
});
