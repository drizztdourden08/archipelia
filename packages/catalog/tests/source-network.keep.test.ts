/* @layer tests @kind test */
import { describe, expect, test, vi } from 'vitest';
import { createGithubClient } from '../src/source/create-github-client';
import { moduleInRepo } from '../src/source/module-in-repo';
import { pypiOffer } from '../src/source/pypi-offer';
import { suggestSources } from '../src/source/suggest-sources';
import { worldContextOf } from '../src/source/world-context-of';
import { API, json, NOW, RAW, repoJson, routedFetch, text } from './source.fixtures';

const REPO = { owner: 'Pseudoarc', repo: 'ctrando' };

const PYPI = 'https://pypi.org/pypi';

const clientOf = (routes: Parameters<typeof routedFetch>[0]) => {
  const { net, seen } = routedFetch(routes);
  return { client: createGithubClient({ fetch: net, now: () => NOW }), net, seen };
};

describe('checking that a repo holds the module', () => {
  test('a project name that matches, in any case, is enough', async () => {
    const { client } = clientOf({ [`${RAW}/Pseudoarc/ctrando/HEAD/pyproject.toml`]: text('[project]\nname = "CTRando"') });
    expect(await moduleInRepo(client, REPO, 'ctrando')).toBe(true);
  });

  test('a package folder with the module name is enough', async () => {
    const { client } = clientOf({ [`${RAW}/Pseudoarc/ctrando/HEAD/src/ctrando/__init__.py`]: text('') });
    expect(await moduleInRepo(client, REPO, 'ctrando')).toBe(true);
  });

  test('a repo with another name and no such folder does not contain it', async () => {
    const { client, seen } = clientOf({ [`${RAW}/Pseudoarc/ctrando/HEAD/pyproject.toml`]: text('[project]\nname = "other"') });
    expect(await moduleInRepo(client, REPO, 'ctrando')).toBe(false);
    expect(seen.every((url) => url.startsWith(RAW))).toBe(true);
  });
});

describe('the Python Package Index under another name', () => {
  const repo = { owner: 'Pseudoarc', repo: 'ctrando' };
  const info = (urls: Record<string, string>) => json({ info: { name: 'CTRando', version: '1.2.0', project_urls: urls, home_page: null } });

  test('a project that points back to the repo is offered as linked', async () => {
    const { net } = routedFetch({ [`${PYPI}/CTRando/json`]: info({ Source: 'https://github.com/pseudoarc/ctrando/' }) });
    expect(await pypiOffer('CTRando', repo, net)).toEqual({ name: 'CTRando', version: '1.2.0', linked: true });
  });

  test('a project of the same name that points elsewhere is not linked', async () => {
    const { net } = routedFetch({ [`${PYPI}/CTRando/json`]: info({ Source: 'https://github.com/someone/else' }) });
    expect(await pypiOffer('CTRando', repo, net)).toMatchObject({ linked: false });
  });

  test('a name PyPI does not have, or a network failure, offers nothing', async () => {
    const { net } = routedFetch({});
    expect(await pypiOffer('CTRando', repo, net)).toBeUndefined();
    expect(await pypiOffer('CTRando', repo, () => Promise.reject(new Error('offline')))).toBeUndefined();
  });
});

describe('suggesting repos for a missing module', () => {
  const routes = () => ({
    [`${API}/repos/Pseudoarc/ctrando`]: json(repoJson('Pseudoarc', 'ctrando')),
    [`${API}/users/author/repos`]: json([repoJson('author', 'ctrdi'), repoJson('author', 'ctrando-helper')]),
    [`${API}/search/repositories`]: json({
      items: [repoJson('lookalike', 'ctrando-clone', { stargazers_count: 0, created_at: '2026-10-20T00:00:00Z' }), repoJson('Pseudoarc', 'ctrando')],
    }),
    [`${RAW}/Pseudoarc/ctrando/HEAD/src/ctrando/__init__.py`]: text(''),
  });
  const world = worldContextOf({ home: 'https://github.com/author/ctrdi', texts: ['Needs https://github.com/Pseudoarc/ctrando to run.'] });

  test('the repo the world links is found once, with both origins, and nothing without the module is shown', async () => {
    const { client } = clientOf(routes());
    const found = await suggestSources({ client, now: () => NOW }, { module: 'ctrando', world });
    expect(found.candidates.map((entry) => entry.id)).toEqual(['Pseudoarc/ctrando']);
    expect(found.candidates[0]).toMatchObject({ origins: ['world', 'search'], contains: true, warnings: [], stars: 120 });
    expect(found.limitedUntil).toBeUndefined();
  });

  test('a pasted repo is shown even when it does not hold the module, and a bad paste is reported', async () => {
    const { client } = clientOf({ [`${API}/repos/some/thing`]: json(repoJson('some', 'thing')) });
    const pasted = await suggestSources({ client, now: () => NOW }, { module: 'ctrando', world: { links: [] }, paste: 'some/thing' });
    expect(pasted.candidates).toMatchObject([{ id: 'some/thing', contains: false, origins: ['pasted'] }]);
    const bad = await suggestSources({ client, now: () => NOW }, { module: 'ctrando', world: { links: [] }, paste: 'not a link' });
    expect(bad.pasteFailed).toBe(true);
  });

  test('the repo the world requirement names is kept, greyed, when the check cannot see the module', async () => {
    const { client } = clientOf({ [`${API}/repos/Pseudoarc/ctrando`]: json(repoJson('Pseudoarc', 'ctrando')) });
    const named = worldContextOf({ linked: 'https://github.com/Pseudoarc/ctrando', texts: [] });
    const found = await suggestSources({ client, now: () => NOW }, { module: 'ctrando', world: named });
    expect(found.candidates).toMatchObject([{ id: 'Pseudoarc/ctrando', contains: false }]);
  });

  test('a rate limit keeps what was found and says when to try again', async () => {
    const reset = Math.floor(NOW / 1000) + 600;
    const limited = () => new Response('{}', { status: 403, headers: { 'x-ratelimit-remaining': '0', 'x-ratelimit-reset': String(reset) } });
    const { client } = clientOf({ ...routes(), [`${API}/search/repositories`]: limited, [`${API}/users/author/repos`]: limited });
    const found = await suggestSources({ client, now: () => NOW }, { module: 'ctrando', world });
    expect(found.limitedUntil).toBe(reset * 1000);
    expect(found.candidates.map((entry) => entry.id)).toEqual(['Pseudoarc/ctrando']);
  });

  test('once limited, the client does not call GitHub again until the reset', async () => {
    const reset = Math.floor(NOW / 1000) + 600;
    const limited = vi.fn(() => new Response('{}', { status: 429, headers: { 'x-ratelimit-reset': String(reset) } }));
    const { client } = clientOf({ [`${API}/search/repositories`]: limited });
    await expect(client.api('/search/repositories?q=a')).rejects.toThrow(/GitHub asks Archipelia to wait/);
    await expect(client.api('/search/repositories?q=b')).rejects.toThrow(/GitHub asks Archipelia to wait/);
    expect(limited).toHaveBeenCalledTimes(1);
  });

  test('an answer is cached, so the same call is not repeated within the hour', async () => {
    const { client, seen } = clientOf({ [`${API}/repos/Pseudoarc/ctrando`]: json(repoJson('Pseudoarc', 'ctrando')) });
    await client.api('/repos/Pseudoarc/ctrando');
    await client.api('/repos/Pseudoarc/ctrando');
    expect(seen).toHaveLength(1);
  });
});
