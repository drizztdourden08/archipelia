/* @layer tests @kind test */
import { describe, expect, test, vi } from 'vitest';
import type { DataFiles } from '@archipelia/model';

const readCatalog = vi.hoisted(() => vi.fn());
vi.mock('../src/read-catalog', () => ({ readCatalog }));

const { createCatalogService } = await import('../src/service/create-catalog-service');

const files = {} as DataFiles;

describe('catalog service reads', () => {
  test('reads that overlap share one fetch, so the cache is written once', async () => {
    let finish: (value: unknown) => void = () => undefined;
    readCatalog.mockImplementation(() => new Promise((resolve) => { finish = resolve; }));
    const service = createCatalogService({ games: files, cache: files, engineDir: () => '' });
    const first = service.read(false);
    const second = service.read(true);
    finish({ apVersion: '0.6.7', entries: [], problems: [] });
    const [a, b] = await Promise.all([first, second]);
    expect(readCatalog).toHaveBeenCalledTimes(1);
    expect(a.apVersion).toBe('0.6.7');
    expect(b.fetchedAt).toBe(a.fetchedAt);
  });
});
