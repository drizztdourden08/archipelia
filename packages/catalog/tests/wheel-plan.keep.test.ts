/* @layer tests @kind test */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import type * as Engine from '@archipelia/engine';
import { createGithubClient } from '../src/source/create-github-client';
import { API, json, NOW, RAW, repoJson, routedFetch, text } from './source.fixtures';
import { assetJson, releaseJson, sha256Of, TAGS, wheelBytes } from './wheel.fixtures';

const state = vi.hoisted(() => ({ tags: [] as string[], asked: 0, broken: false }));

vi.mock('@archipelia/engine', async (original) => ({
  ...(await original<typeof Engine>()),
  readRuntime: () => Promise.resolve({ python: 'C:\\engine\\python.exe' }),
  engineTags: () => { state.asked += 1; return state.broken ? Promise.reject(new Error('no python')) : Promise.resolve(state.tags); },
}));

const { planSource } = await import('../src/source/plan-source');

const HEAD = 'a'.repeat(40);

const REPO = `${API}/repos/Pseudoarc/ctrando`;

const BYTES = wheelBytes();

beforeEach(() => {
  state.tags = TAGS;
  state.asked = 0;
  state.broken = false;
});

type Routes = Parameters<typeof routedFetch>[0];

const routes = (releases: Response | (() => Response) | undefined, extra: Routes = {}): Routes => ({
  [REPO]: json(repoJson('Pseudoarc', 'ctrando')),
  [`${REPO}/commits/main`]: json({ sha: HEAD, commit: { committer: { date: '2026-10-20T00:00:00Z' } } }),
  [`${REPO}/tags`]: json([]),
  [`${REPO}/git/trees/${HEAD}`]: json({ tree: [{ path: 'src/ctrando/compression/compress.c' }] }),
  [`${RAW}/Pseudoarc/ctrando/${HEAD}/pyproject.toml`]: text('[project]\nname = "ctrando"'),
  ...(releases ? { [`${REPO}/releases`]: releases } : {}),
  ...extra,
});

const planOf = (table: Routes) => {
  const { net } = routedFetch(table);
  const client = createGithubClient({ fetch: net, now: () => NOW });
  const engineDir = () => Promise.resolve('engine');
  return planSource({ client, engineDir, fetch: net }, { module: 'ctrando', repo: 'ctrando', owner: 'Pseudoarc' });
};

describe('the ready-made build in the plan of a repo', () => {
  test('a repo with no releases, like Pseudoarc/ctrando, has none, asks the engine for nothing and keeps the manual and build paths', async () => {
    const plan = await planOf(routes(undefined));
    expect(plan).toMatchObject({ wheelState: 'none', native: true, pin: { kind: 'head', sha: HEAD } });
    expect(plan.wheel).toBeUndefined();
    expect(plan.command).toContain(`git+https://github.com/Pseudoarc/ctrando@${HEAD}`);
    expect(state.asked).toBe(0);
  });

  test('releases with only source archives have none', async () => {
    const plan = await planOf(routes(json([releaseJson('v1', [{ name: 'source.tar.gz', size: 10, state: 'uploaded' }])])));
    expect(plan.wheelState).toBe('none');
    expect(state.asked).toBe(0);
  });

  test('a release with a wheel that fits this engine is offered with its tag, size, digest and fit', async () => {
    const plan = await planOf(routes(json([releaseJson('v1.2.0', [assetJson('ctrando-1.2.0-cp312-cp312-win_amd64.whl', BYTES)])])));
    expect(plan.wheelState).toBe('found');
    expect(plan.wheel).toEqual({
      tag: 'v1.2.0', asset: 'ctrando-1.2.0-cp312-cp312-win_amd64.whl', size: BYTES.length, digest: sha256Of(BYTES), fit: 'exact',
    });
  });

  test('a wheel without a digest is offered with no digest, so the dialog asks for the typed name', async () => {
    const plan = await planOf(routes(json([releaseJson('v1.2.0', [assetJson('ctrando-1.2.0-py3-none-any.whl', BYTES, false)])])));
    expect(plan.wheel).toMatchObject({ fit: 'pure', digest: undefined });
  });

  test('wheels for another Python or platform leave the plan with none', async () => {
    const plan = await planOf(routes(json([releaseJson('v1.2.0', [assetJson('ctrando-1.2.0-cp313-cp313-win_amd64.whl', BYTES)])])));
    expect(plan.wheelState).toBe('none');
    expect(plan.wheel).toBeUndefined();
  });

  test('when GitHub cannot be read for releases the plan still comes back and says it does not know', async () => {
    const limited = () => new Response('', { status: 403, headers: { 'x-ratelimit-remaining': '0', 'x-ratelimit-reset': String(Math.floor(NOW / 1000) + 600) } });
    const plan = await planOf(routes(limited));
    expect(plan.wheelState).toBe('unknown');
    expect(plan.pin.sha).toBe(HEAD);
  });

  test('an engine that cannot list its tags leaves the plan with unknown, not an error', async () => {
    state.broken = true;
    const plan = await planOf(routes(json([releaseJson('v1.2.0', [assetJson('ctrando-1.2.0-cp312-cp312-win_amd64.whl', BYTES)])])));
    expect(plan.wheelState).toBe('unknown');
    expect(plan.pin.sha).toBe(HEAD);
  });
});
