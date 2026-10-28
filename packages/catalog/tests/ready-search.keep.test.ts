/* @layer tests @kind test */
import { describe, expect, test, vi } from 'vitest';
import { createReadySearch } from '../src/ready/create-ready-search';
import { memoryFiles } from './memory-files.fixtures';

const API = 'https://api.github.com/search/repositories';

const item = (id: number, patch: Record<string, unknown> = {}) => ({
  id, full_name: `owner${id}/world-${id}`, owner: { login: `owner${id}` }, topics: ['archipelia-world'], fork: false, archived: false, disabled: false,
  stargazers_count: id, pushed_at: '2026-10-01T00:00:00Z', created_at: '2026-01-01T00:00:00Z', ...patch,
});

const page = (items: unknown[], total: number, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify({ total_count: total, items }), { status: 200, headers });

const urlOf = (input: unknown) => String(input);

const call = (fetchFn: ReturnType<typeof vi.fn>, at: number) => fetchFn.mock.calls[at] as [unknown, { headers: Record<string, string> }];

describe('the Archipelia ready search paging', () => {
  test('asks for the topic once, follows the next link and drops forks, archived, disabled and untagged repos', async () => {
    const fetchFn = vi.fn()
      .mockResolvedValueOnce(page([item(1), item(2, { fork: true }), item(3, { archived: true })], 5, { link: `<${API}?q=x&page=2>; rel="next", <${API}?q=x&page=3>; rel="last"`, etag: '"one"' }))
      .mockResolvedValueOnce(page([item(4, { disabled: true }), item(5, { topics: ['other'] }), item(6, { topics: ['archipelia-world', 'archipelia-direct'] })], 5));
    const search = createReadySearch({ files: memoryFiles([]), fetch: fetchFn, now: () => 1000 });
    const got = await search(false);
    expect(got.repos.map((repo) => repo.id)).toEqual([1, 6]);
    expect(got.repos[1]).toMatchObject({ fullName: 'owner6/world-6', owner: 'owner6', direct: true });
    expect(got.repos[0]).toMatchObject({ direct: false, stars: 1 });
    expect(got.fetched).toBe(6);
    expect(got.total).toBe(5);
    const first = urlOf(call(fetchFn, 0)[0]);
    expect(first).toContain(`${API}?q=topic%3Aarchipelia-world%20archived%3Afalse`);
    expect(first).toContain('sort=updated');
    expect(first).toContain('per_page=100');
    expect(urlOf(call(fetchFn, 1)[0])).toBe(`${API}?q=x&page=2`);
  });

  test('stops at five pages and reports the total that was cut', async () => {
    const fetchFn = vi.fn((input: unknown) => {
      const at = Number(/page=(\d+)/.exec(urlOf(input))?.[1] ?? 1);
      return Promise.resolve(page([item(at * 10)], 900, { link: `<${API}?q=x&page=${at + 1}>; rel="next"` }));
    });
    const got = await createReadySearch({ files: memoryFiles([]), fetch: fetchFn, now: () => 1000 })(false);
    expect(fetchFn).toHaveBeenCalledTimes(5);
    expect(got).toMatchObject({ total: 900, fetched: 5 });
  });

  test('never follows a next link that leaves the search endpoint', async () => {
    const fetchFn = vi.fn().mockResolvedValue(page([item(1)], 1, { link: '<https://evil.example/search?page=2>; rel="next"' }));
    await createReadySearch({ files: memoryFiles([]), fetch: fetchFn, now: () => 1000 })(false);
    expect(fetchFn).toHaveBeenCalledOnce();
  });

});

describe('the Archipelia ready search cache', () => {
  test('uses the saved list for six hours, and a forced refresh no more than once a minute', async () => {
    let clock = 1000;
    const fetchFn = vi.fn().mockImplementation(() => Promise.resolve(page([item(1)], 1, { etag: '"one"' })));
    const files = memoryFiles([]);
    const search = createReadySearch({ files, fetch: fetchFn, now: () => clock });
    await search(false);
    clock += 5 * 60 * 60 * 1000;
    expect((await search(false)).repos).toHaveLength(1);
    expect(fetchFn).toHaveBeenCalledOnce();
    clock += 2 * 60 * 1000;
    await search(true);
    expect(fetchFn).toHaveBeenCalledTimes(2);
    expect(call(fetchFn, 1)[1].headers['if-none-match']).toBe('"one"');
    clock += 30 * 1000;
    await search(true);
    expect(fetchFn).toHaveBeenCalledTimes(2);
  });

  test('a new session reads the saved list from disk with no request', async () => {
    const files = memoryFiles([]);
    await createReadySearch({ files, fetch: vi.fn().mockResolvedValue(page([item(1)], 1)), now: () => 1000 })(false);
    const fetchFn = vi.fn();
    const again = await createReadySearch({ files, fetch: fetchFn, now: () => 2000 })(false);
    expect(again.repos.map((repo) => repo.id)).toEqual([1]);
    expect(fetchFn).not.toHaveBeenCalled();
  });

  test('a 304 on the first page keeps the saved list and the time moves forward', async () => {
    let clock = 1000;
    const files = memoryFiles([]);
    const fetchFn = vi.fn()
      .mockResolvedValueOnce(page([item(1)], 1, { etag: '"one"' }))
      .mockResolvedValueOnce(new Response(null, { status: 304 }));
    const search = createReadySearch({ files, fetch: fetchFn, now: () => clock });
    await search(false);
    clock += 7 * 60 * 60 * 1000;
    const again = await search(false);
    expect(again.repos.map((repo) => repo.id)).toEqual([1]);
    expect(again.fetchedAt).toBe(clock);
    expect(again.problems).toEqual([]);
  });

});

describe('the Archipelia ready search when GitHub says no', () => {
  test('a rate limit keeps the saved list, reports when to try again and sends nothing until then', async () => {
    let clock = 1000;
    const files = memoryFiles([]);
    const reset = Math.floor((clock + 30 * 60 * 60 * 1000) / 1000);
    const fetchFn = vi.fn()
      .mockResolvedValueOnce(page([item(1)], 1))
      .mockResolvedValue(new Response('{}', { status: 403, headers: { 'x-ratelimit-remaining': '0', 'x-ratelimit-reset': String(reset) } }));
    const search = createReadySearch({ files, fetch: fetchFn, now: () => clock });
    await search(false);
    clock += 7 * 60 * 60 * 1000;
    const limited = await search(false);
    expect(limited.repos.map((repo) => repo.id)).toEqual([1]);
    expect(limited.limitedUntil).toBe(reset * 1000);
    expect(limited.problems).toEqual([]);
    clock += 60 * 1000;
    await search(true);
    expect(fetchFn).toHaveBeenCalledTimes(2);
  });

  test('with no saved list a failed search shows one problem and no worlds', async () => {
    const got = await createReadySearch({ files: memoryFiles([]), fetch: vi.fn().mockRejectedValue(new Error('offline')), now: () => 1000 })(false);
    expect(got.repos).toEqual([]);
    expect(got.problems).toEqual(['Archipelia ready search: offline']);
  });
});
