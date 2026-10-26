/* @layer tests @kind test */
import { describe, expect, test, vi } from 'vitest';
import type * as Engine from '@archipelia/engine';
import { createGithubClient } from '../src/source/create-github-client';
import { parseSourceRef } from '../src/source/parse-source-ref';
import { parseSuggestRequest } from '../src/source/parse-suggest-request';
import { API, json, NOW, RAW, repoJson, routedFetch, text } from './source.fixtures';

vi.mock('@archipelia/engine', async (original) => ({
  ...(await original<typeof Engine>()),
  readRuntime: () => Promise.resolve({ python: 'C:\\engine\\python.exe' }),
}));

const { planSource } = await import('../src/source/plan-source');

const HEAD = 'a'.repeat(40);

const TAG = 'b'.repeat(40);

const REPO = `${API}/repos/Pseudoarc/ctrando`;

const routes = (extra: Record<string, Response> = {}) => ({
  [REPO]: json(repoJson('Pseudoarc', 'ctrando')),
  [`${REPO}/commits/main`]: json({ sha: HEAD, commit: { committer: { date: '2026-10-20T00:00:00Z' } } }),
  [`${REPO}/commits/${TAG}`]: json({ sha: TAG, commit: { committer: { date: '2026-09-01T00:00:00Z' } } }),
  [`${REPO}/tags`]: json([{ name: 'v1.2.0', commit: { sha: HEAD } }, { name: 'v1.10.0', commit: { sha: TAG } }]),
  [`${REPO}/git/trees/${TAG}`]: json({ tree: [{ path: 'src/ctrando/compression/compress.c' }, { path: 'pyproject.toml' }] }),
  [`${RAW}/Pseudoarc/ctrando/${TAG}/pyproject.toml`]: text('[project]\nname = "CTRando"\nversion = "1.10.0"'),
  'https://pypi.org/pypi/CTRando/json': json({ info: { name: 'CTRando', version: '1.10.0', project_urls: { Source: 'https://github.com/Pseudoarc/ctrando' } } }),
  ...extra,
});

const planOf = (table: Record<string, Response>) => {
  const { net } = routedFetch(table);
  return planSource(
    { client: createGithubClient({ fetch: net, now: () => NOW }), fetch: net, engineDir: () => Promise.resolve('engine') },
    { owner: 'Pseudoarc', repo: 'ctrando', module: 'ctrando' },
  );
};

describe('planning the install of a chosen repo', () => {
  test('pins the newest tag, builds the command for the engine Python and reads the build facts', async () => {
    const plan = await planOf(routes());
    expect(plan.pin).toEqual({ kind: 'tag', ref: 'v1.10.0', sha: TAG, date: '2026-09-01T00:00:00Z' });
    expect(plan.command).toBe(`"C:\\engine\\python.exe" -m pip install "git+https://github.com/Pseudoarc/ctrando@${TAG}"`);
    expect(plan).toMatchObject({ python: 'C:\\engine\\python.exe', native: true, submodules: false, unsure: false, projectName: 'CTRando' });
    expect(plan.pypi).toEqual({ name: 'CTRando', version: '1.10.0', linked: true });
  });

  test('a repo with no tags pins the head of its default branch', async () => {
    const plan = await planOf(routes({
      [`${REPO}/tags`]: json([]),
      [`${REPO}/git/trees/${HEAD}`]: json({ tree: [{ path: 'a.py' }] }),
      [`${RAW}/Pseudoarc/ctrando/${HEAD}/pyproject.toml`]: text('[project]\nname = "ctrando"'),
    }));
    expect(plan.pin).toEqual({ kind: 'head', ref: 'main', sha: HEAD, date: '2026-10-20T00:00:00Z' });
  });

  test('a repo that does not exist is reported in plain words', async () => {
    await expect(planOf({})).rejects.toThrow('GitHub has no repository Pseudoarc/ctrando.');
  });
});

describe('what the renderer may send', () => {
  test('an owner, a repo and a module name are checked, and a distribution name becomes a module name', () => {
    expect(parseSourceRef({ owner: 'Pseudoarc', repo: 'ctrando', module: 'ct-rando' })).toEqual({ owner: 'Pseudoarc', repo: 'ctrando', module: 'ct_rando' });
    expect(() => parseSourceRef({ owner: 'a/b', repo: 'x', module: 'm' })).toThrow('not valid');
    expect(() => parseSourceRef({ owner: 'a', repo: '..', module: 'm' })).toThrow('not valid');
    expect(() => parseSourceRef({ owner: 'a', repo: 'x', module: 'm; rm' })).toThrow('not valid');
    expect(() => parseSourceRef(null)).toThrow('not valid');
  });

  test('a suggestion request needs a safe world name and a module, and trims what is too long', () => {
    expect(parseSuggestRequest({ apworld: 'ctrdi', module: 'ctrando', paste: 'x'.repeat(500) })).toEqual({ apworld: 'ctrdi', module: 'ctrando', linked: undefined, paste: undefined });
    expect(() => parseSuggestRequest({ apworld: '../x', module: 'ctrando' })).toThrow('not valid');
  });
});
