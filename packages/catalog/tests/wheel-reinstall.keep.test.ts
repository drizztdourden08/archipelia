/* @layer tests @kind test */
import { afterAll, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import type * as Engine from '@archipelia/engine';
import type { EngineRuntime, InstalledGame, PackageSource } from '@archipelia/model';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { memoryFiles, recordOf } from './memory-files.fixtures';
import { cacheWheel, downloadUrl, sha256Of, TAGS, WHEEL, wheelBytes } from './wheel.fixtures';

const state = vi.hoisted(() => ({ tags: [] as string[], installed: [] as unknown[] }));

vi.mock('@archipelia/engine', async (original) => ({
  ...(await original<typeof Engine>()),
  engineTags: () => Promise.resolve(state.tags),
  installWheel: (...call: unknown[]) => { state.installed.push(call); return Promise.resolve(); },
  installPackages: () => Promise.resolve(),
}));

const { reinstallSources } = await import('../src/wheel/reinstall-sources');
const { carryWorlds } = await import('../src/install/carry-worlds');

const BYTES = wheelBytes();

const CDN = 'https://release-assets.githubusercontent.com/abc';

let base = '';

beforeAll(async () => {
  base = await mkdtemp(join(tmpdir(), 'archipelia-wheel-reinstall-'));
});

afterAll(() => rm(base, { recursive: true, force: true }));

beforeEach(() => {
  state.tags = TAGS;
  state.installed = [];
});

const runtimeIn = async (name: string): Promise<EngineRuntime> => {
  const root = join(base, name);
  await mkdir(join(root, 'ap', 'custom_worlds'), { recursive: true });
  return { id: name, apVersion: '0.6.8', apCommit: '', pythonVersion: '3.12', root, python: 'python', generate: '', multiServer: '', schemaScript: '' };
};

const sourceOf = (patch: Partial<PackageSource> = {}): PackageSource => ({
  repo: 'Pseudoarc/ctrando', tag: 'v1.2.0', asset: WHEEL, sha256: sha256Of(BYTES), verified: true, name: 'ctrando', version: '1.2.0', ...patch,
});

const recordWith = (sources: PackageSource[] | undefined): InstalledGame => ({ ...recordOf('ctrdi', { source: 'index', path: 'custom_worlds/ctrdi.apworld' }), game: 'Chrono', ...(sources ? { sources } : {}) });

const serving = (served: Uint8Array = BYTES) => {
  const seen: string[] = [];
  const net = ((input: string | URL | Request) => {
    const url = String(input);
    seen.push(url);
    if (url === downloadUrl('v1.2.0', WHEEL)) return Promise.resolve(new Response(null, { status: 302, headers: { location: CDN } }));
    return Promise.resolve(url === CDN ? new Response(served) : new Response('', { status: 404 }));
  }) as typeof fetch;
  return { net, seen };
};

describe('the ready-made build after an engine change', () => {
  test('installs the very wheel on record from this engine own cache, with no download', async () => {
    const runtime = await runtimeIn('cached');
    const { file } = await cacheWheel(runtime, BYTES, { repo: 'Pseudoarc/ctrando', tag: 'v1.2.0', asset: WHEEL, verified: true });
    const { net, seen } = serving();
    await reinstallSources(runtime, recordWith([sourceOf()]), net);
    expect(state.installed).toEqual([[runtime, { file, sha256: sha256Of(BYTES) }]]);
    expect(seen).toEqual([]);
  });

  test('fetches the same release file for a new engine and installs it only when it matches the recorded hash', async () => {
    const runtime = await runtimeIn('fetched');
    const { net, seen } = serving();
    await reinstallSources(runtime, recordWith([sourceOf()]), net);
    expect(seen).toEqual([downloadUrl('v1.2.0', WHEEL), CDN]);
    expect(state.installed).toHaveLength(1);
    const again = serving();
    await reinstallSources(runtime, recordWith([sourceOf()]), again.net);
    expect(again.seen).toEqual([]);
  });

  test('refuses bytes that are not the ones the user reviewed, and installs nothing', async () => {
    const runtime = await runtimeIn('changed');
    const { net } = serving(Uint8Array.from(BYTES, (byte, at) => (at === 10 ? byte ^ 1 : byte)));
    await expect(reinstallSources(runtime, recordWith([sourceOf()]), net)).rejects.toThrow('does not match the checksum on record');
    expect(state.installed).toEqual([]);
  });

  test('asks again, with no download, when no build of the recorded wheel fits the new engine', async () => {
    const runtime = await runtimeIn('newpython');
    state.tags = ['cp313-cp313-win_amd64', 'cp313-abi3-win_amd64', 'py3-none-any'];
    const { net, seen } = serving();
    await expect(reinstallSources(runtime, recordWith([sourceOf()]), net)).rejects.toThrow(
      'Chrono used ctrando 1.2.0 from GitHub release v1.2.0 of Pseudoarc/ctrando, and that build does not fit this engine. Install the package again from the game card.',
    );
    expect(seen).toEqual([]);
    expect(state.installed).toEqual([]);
  });

  test('a pure Python wheel on record fits a new engine of any Python', async () => {
    const runtime = await runtimeIn('pure');
    state.tags = ['cp313-cp313-win_amd64', 'py3-none-any'];
    const bytes = wheelBytes({ version: '1.0.0' });
    const { file } = await cacheWheel(runtime, bytes, { repo: 'Pseudoarc/ctrando', tag: 'v1.0.0', asset: 'ctrando-1.0.0-py3-none-any.whl', verified: false });
    await reinstallSources(runtime, recordWith([sourceOf({ asset: 'ctrando-1.0.0-py3-none-any.whl', sha256: sha256Of(bytes), verified: false })]));
    expect(state.installed).toEqual([[runtime, { file, sha256: sha256Of(bytes) }]]);
  });

  test('a world installed with no wheel has nothing to reinstall', async () => {
    const { net, seen } = serving();
    await reinstallSources(await runtimeIn('none'), recordWith(undefined), net);
    expect(seen).toEqual([]);
    expect(state.installed).toEqual([]);
  });
});

describe('carrying a world with a ready-made build to another engine', () => {
  test('copies the world and reinstalls its wheel, or reports the world as a problem when no wheel fits', async () => {
    const [from, to, late] = [await runtimeIn('carry-from'), await runtimeIn('carry-to'), await runtimeIn('carry-late')];
    await writeFile(join(from.root, 'ap', 'custom_worlds', 'ctrdi.apworld'), 'world');
    await cacheWheel(to, BYTES, { repo: 'Pseudoarc/ctrando', tag: 'v1.2.0', asset: WHEEL, verified: true });
    const record = recordWith([sourceOf()]);
    const unused = () => Promise.resolve();
    const ok = await carryWorlds({ from, to, files: memoryFiles([record]), reinstall: unused, reinstallFirstParty: unused });
    expect(ok.copied).toEqual(['ctrdi']);
    expect(ok.problems).toEqual([]);
    expect(state.installed).toHaveLength(1);
    state.tags = ['cp313-cp313-win_amd64'];
    const bad = await carryWorlds({ from, to: late, files: memoryFiles([record]), reinstall: unused, reinstallFirstParty: unused });
    expect(bad.copied).toEqual([]);
    expect(bad.problems).toHaveLength(1);
    expect(bad.problems[0]).toMatchObject({ apworld: 'ctrdi', game: 'Chrono' });
    expect(bad.problems[0]?.reason).toContain('does not fit this engine');
  });
});
