/* @layer tests @kind test */
import { mkdir, mkdtemp, readdir, rm, utimes, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import type { EngineRuntime, SourcePlan } from '@archipelia/model';
import { createSourceService } from '../src/source/create-source-service';
import { createOfferedWheels } from '../src/wheel/create-offered-wheels';
import { pruneWheels } from '../src/wheel/prune-wheels';
import { cacheWheel, WHEEL, wheelBytes } from './wheel.fixtures';

const ASK = { owner: 'Pseudoarc', repo: 'ctrando', module: 'ctrando', tag: 'v1.2.0', asset: WHEEL };

const planWith = (wheel: boolean): SourcePlan => ({
  owner: 'pseudoarc', repo: 'CTRando', ...(wheel ? { wheel: { tag: 'v1.2.0', asset: WHEEL, size: 5, digest: undefined, fit: 'exact' as const } } : {}),
} as SourcePlan);

describe('which ready-made build may be downloaded', () => {
  test('only the one a plan offered for that repo, whatever the case of the names', () => {
    const offers = createOfferedWheels();
    expect(() => offers.assertOffered(ASK)).toThrow('Open the project from the list again');
    offers.offer(planWith(true));
    expect(() => offers.assertOffered(ASK)).not.toThrow();
    expect(() => offers.assertOffered({ ...ASK, tag: 'v9' })).toThrow('only downloads the ready-made build it offered');
    expect(() => offers.assertOffered({ ...ASK, asset: 'other-1-py3-none-any.whl' })).toThrow('offered');
    expect(() => offers.assertOffered({ ...ASK, repo: 'other' })).toThrow('offered');
  });

  test('a later plan with no build withdraws the offer', () => {
    const offers = createOfferedWheels();
    offers.offer(planWith(true));
    offers.offer(planWith(false));
    expect(() => offers.assertOffered(ASK)).toThrow('offered');
  });

  test('the source service refuses a download for a project nobody opened, before it touches the network', () => {
    const calls: string[] = [];
    const net = ((input: string | URL | Request) => { calls.push(String(input)); return Promise.reject(new Error('offline')); }) as typeof fetch;
    const service = createSourceService({ fetch: net, engineDir: () => Promise.resolve('engine'), worldOf: () => Promise.resolve({ texts: [] }) });
    expect(() => service.wheel(ASK)).toThrow('Open the project from the list again');
    expect(calls).toEqual([]);
  });
});

describe('the size of the wheel cache', () => {
  let base = '';

  beforeAll(async () => {
    base = await mkdtemp(join(tmpdir(), 'archipelia-wheel-prune-'));
  });

  afterAll(() => rm(base, { recursive: true, force: true }));

  const runtimeIn = async (name: string): Promise<EngineRuntime> => {
    const root = join(base, name);
    await mkdir(root, { recursive: true });
    return { id: name, apVersion: '0.6.8', apCommit: '', pythonVersion: '3.12', root, python: 'python', generate: '', multiServer: '', schemaScript: '' };
  };

  test('drops the oldest wheels first until the cache fits, and never the one just stored', async () => {
    const runtime = await runtimeIn('prune');
    const label = { repo: 'Pseudoarc/ctrando', tag: 'v1', asset: WHEEL, verified: true };
    const found = [];
    for (const [index, version] of ['1.0.0', '1.1.0', '1.2.0'].entries()) {
      const cached = await cacheWheel(runtime, wheelBytes({ version }), label);
      await utimes(cached.dir, new Date(2026, 0, index + 1), new Date(2026, 0, index + 1));
      found.push(cached);
    }
    const [oldest, middle, newest] = found;
    await pruneWheels(runtime, oldest?.sha256 ?? '', 1);
    const left = await readdir(join(runtime.root, 'wheels'));
    expect(left).toContain(oldest?.sha256);
    expect(left).not.toContain(middle?.sha256);
    expect(left).not.toContain(newest?.sha256);
  });

  test('keeps everything while it fits, and removes part files older than an hour', async () => {
    const runtime = await runtimeIn('keep');
    const cached = await cacheWheel(runtime, wheelBytes(), { repo: 'Pseudoarc/ctrando', tag: 'v1', asset: WHEEL, verified: true });
    const stale = join(runtime.root, 'wheels', 'old.part');
    const fresh = join(runtime.root, 'wheels', 'new.part');
    await writeFile(stale, 'x');
    await writeFile(fresh, 'x');
    await utimes(stale, new Date(2026, 0, 1), new Date(2026, 0, 1));
    await pruneWheels(runtime, cached.sha256, undefined, Date.now());
    expect((await readdir(join(runtime.root, 'wheels'))).sort()).toEqual([cached.sha256, 'new.part'].sort());
  });
});
