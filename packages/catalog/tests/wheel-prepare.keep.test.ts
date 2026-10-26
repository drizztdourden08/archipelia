/* @layer tests @kind test */
import { mkdtemp, readdir, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import type * as Engine from '@archipelia/engine';
import type { EngineRuntime, SourceWheelRequest } from '@archipelia/model';
import { createGithubClient } from '../src/source/create-github-client';
import { API, json, NOW, routedFetch } from './source.fixtures';
import { assetJson, downloadUrl, releaseJson, sha256Of, TAGS, WHEEL, wheelBytes } from './wheel.fixtures';

const state = vi.hoisted(() => ({ runtime: undefined as EngineRuntime | undefined, tags: [] as string[] }));

vi.mock('@archipelia/engine', async (original) => ({
  ...(await original<typeof Engine>()),
  readRuntime: () => Promise.resolve(state.runtime),
  engineTags: () => Promise.resolve(state.tags),
}));

const { prepareWheel } = await import('../src/wheel/prepare-wheel');

const BYTES = wheelBytes();

const CDN = 'https://release-assets.githubusercontent.com/abc';

let base = '';

beforeAll(async () => {
  base = await mkdtemp(join(tmpdir(), 'archipelia-wheel-prepare-'));
});

afterAll(() => rm(base, { recursive: true, force: true }));

beforeEach(async () => {
  const root = await mkdtemp(join(base, 'engine-'));
  state.runtime = { id: 'e', root, python: 'python' } as EngineRuntime;
  state.tags = TAGS;
});

const request = (patch: Partial<SourceWheelRequest> = {}): SourceWheelRequest => ({ owner: 'Pseudoarc', repo: 'ctrando', module: 'ctrando', tag: 'v1.2.0', asset: WHEEL, ...patch });

const redirect = (to: string) => () => new Response(null, { status: 302, headers: { location: to } });

const bed = (options: { digest?: boolean; served?: Uint8Array; hop?: string } = {}) => {
  const { digest = true, served = BYTES, hop = CDN } = options;
  const { net, seen } = routedFetch({
    [`${API}/repos/Pseudoarc/ctrando/releases`]: json([releaseJson('v1.2.0', [assetJson(WHEEL, BYTES, digest)])]),
    [downloadUrl('v1.2.0', WHEEL)]: redirect(hop),
    [CDN]: () => new Response(served),
  });
  const prepare = (patch: Partial<SourceWheelRequest> = {}) => prepareWheel(
    { client: createGithubClient({ fetch: net, now: () => NOW }), fetch: net, engineDir: () => Promise.resolve('engine') }, request(patch),
  );
  return { prepare, seen };
};

const cached = (): Promise<string[]> => readdir(join((state.runtime as EngineRuntime).root, 'wheels')).catch(() => []);

describe('getting a ready-made build from a release', () => {
  test('downloads the file of the chosen release, checks it against the digest GitHub publishes, and records where it came from', async () => {
    const { prepare, seen } = bed();
    const source = await prepare();
    expect(source).toEqual({ repo: 'Pseudoarc/ctrando', tag: 'v1.2.0', asset: WHEEL, sha256: sha256Of(BYTES), verified: true, name: 'ctrando', version: '1.2.0' });
    expect(seen).toContain(downloadUrl('v1.2.0', WHEEL));
    expect(seen).toContain(CDN);
    expect(await cached()).toEqual([sha256Of(BYTES)]);
  });

  test('never takes an address from the release: the download address is built from the repo, the tag and the file name', async () => {
    const { prepare, seen } = bed();
    await prepare();
    expect(seen.some((url) => url.includes('evil.example'))).toBe(false);
  });

  test('keeps the file per engine and does not download it again when the digest is already cached', async () => {
    const { prepare, seen } = bed();
    await prepare();
    await prepare();
    expect(seen.filter((url) => url === CDN)).toHaveLength(1);
  });

  test('refuses a download that does not match the published digest, and keeps nothing', async () => {
    const { prepare } = bed({ served: Uint8Array.from(BYTES, (byte, at) => (at === 10 ? byte ^ 1 : byte)) });
    await expect(prepare()).rejects.toThrow('does not match the checksum on record');
    expect(await cached()).toEqual([]);
  });

  test('with no published digest it refuses until the repo name is typed, then installs and marks it unchecked', async () => {
    const { prepare } = bed({ digest: false });
    await expect(prepare()).rejects.toThrow('publishes no checksum');
    await expect(prepare({ typed: 'Pseudoarc' })).rejects.toThrow('publishes no checksum');
    expect(await cached()).toEqual([]);
    const source = await prepare({ typed: ' pseudoarc/CTRANDO ' });
    expect(source).toMatchObject({ verified: false, sha256: sha256Of(BYTES) });
  });

  test('says there is no build when the file does not fit this engine, and when the release does not list it', async () => {
    state.tags = ['cp313-cp313-win_amd64'];
    await expect(bed().prepare()).rejects.toThrow('No ready-made build for this engine');
    state.tags = TAGS;
    await expect(bed().prepare({ asset: 'ctrando-1.2.0-cp312-cp312-win_arm64.whl' })).rejects.toThrow('has no release file');
    await expect(bed().prepare({ tag: 'v9' })).rejects.toThrow('has no release file');
  });

  test('refuses a wheel that does not hold the package the world needs', async () => {
    const other = wheelBytes({ modules: ['someotherthing'] });
    const { net } = routedFetch({
      [`${API}/repos/Pseudoarc/ctrando/releases`]: json([releaseJson('v1.2.0', [assetJson(WHEEL, other)])]),
      [downloadUrl('v1.2.0', WHEEL)]: () => new Response(other),
    });
    const deps = { client: createGithubClient({ fetch: net, now: () => NOW }), fetch: net, engineDir: () => Promise.resolve('engine') };
    await expect(prepareWheel(deps, request())).rejects.toThrow('does not contain the package ctrando');
    expect(await cached()).toEqual([]);
  });

  test('refuses a wheel whose own metadata names another package than its file name', async () => {
    const liar = wheelBytes({ name: 'otherpkg' });
    const { net } = routedFetch({
      [`${API}/repos/Pseudoarc/ctrando/releases`]: json([releaseJson('v1.2.0', [assetJson(WHEEL, liar)])]),
      [downloadUrl('v1.2.0', WHEEL)]: () => new Response(liar),
    });
    const deps = { client: createGithubClient({ fetch: net, now: () => NOW }), fetch: net, engineDir: () => Promise.resolve('engine') };
    await expect(prepareWheel(deps, request())).rejects.toThrow('does not match its file name');
  });
});

describe('where a download may come from', () => {
  test('follows GitHub to its own file host and nowhere else', async () => {
    await expect(bed({ hop: 'https://evil.example/ctrando.whl' }).prepare()).rejects.toThrow('only downloads release files from github.com over https');
    await expect(bed({ hop: 'http://objects.githubusercontent.com/ctrando.whl' }).prepare()).rejects.toThrow('only downloads release files from github.com over https');
    await expect(bed({ hop: 'https://githubusercontent.com.evil.example/x' }).prepare()).rejects.toThrow('only downloads release files');
    expect(await cached()).toEqual([]);
  });

  test('takes only the two GitHub file hosts after the release address, and never another GitHub host or the same address twice', async () => {
    for (const hop of ['https://raw.githubusercontent.com/o/r/main/x.whl', 'https://github.com/other/repo/releases/download/v1/x.whl', 'https://objects.githubusercontent.com:8443/x']) {
      await expect(bed({ hop }).prepare()).rejects.toThrow('only downloads release files');
    }
    const { prepare } = bed({ hop: 'https://objects.githubusercontent.com/github-production-release-asset/abc' });
    await expect(prepare()).rejects.toThrow('GitHub answered 404');
  });

  test('records that the release is not the newest when an older one is used', async () => {
    const { net } = routedFetch({
      [`${API}/repos/Pseudoarc/ctrando/releases`]: json([
        releaseJson('v2.0.0', [assetJson('ctrando-2.0.0-cp313-cp313-win_amd64.whl', BYTES)]), releaseJson('v1.2.0', [assetJson(WHEEL, BYTES)]),
      ]),
      [downloadUrl('v1.2.0', WHEEL)]: redirect(CDN),
      [CDN]: () => new Response(BYTES),
    });
    const deps = { client: createGithubClient({ fetch: net, now: () => NOW }), fetch: net, engineDir: () => Promise.resolve('engine') };
    expect(await prepareWheel(deps, request())).toMatchObject({ tag: 'v1.2.0', newest: 'v2.0.0' });
    expect((await prepareWheel(deps, request())).newest).toBe('v2.0.0');
  });

  test.each(['--index-url https://evil.example/simple', 'evil @ git+https://evil.example/x.git', '-r /etc/passwd'])(
    'a wheel that lists %j as a dependency is refused when it is downloaded, and keeps nothing',
    async (line) => {
      const hostile = wheelBytes({ requires: [line] });
      const { net } = routedFetch({
        [`${API}/repos/Pseudoarc/ctrando/releases`]: json([releaseJson('v1.2.0', [assetJson(WHEEL, hostile)])]),
        [downloadUrl('v1.2.0', WHEEL)]: () => new Response(hostile),
      });
      const deps = { client: createGithubClient({ fetch: net, now: () => NOW }), fetch: net, engineDir: () => Promise.resolve('engine') };
      await expect(prepareWheel(deps, request())).rejects.toThrow('lists a requirement Archipelia will not install');
      expect(await cached()).toEqual([]);
    },
  );

  test('a download that grows past the size the release lists is stopped', async () => {
    const { prepare } = bed({ served: new Uint8Array([...BYTES, 1, 2, 3]) });
    await expect(prepare()).rejects.toThrow('bytes, the release says');
    expect(await stat(join((state.runtime as EngineRuntime).root, 'wheels')).then(() => true, () => false)).toBe(true);
    expect(await cached()).toEqual([]);
  });

  test('refuses requests that are not an owner, a repo, a module, a tag and a wheel name', async () => {
    const { parseWheelRequest } = await import('../src/wheel/parse-wheel-request');
    expect(parseWheelRequest({ owner: 'a', repo: 'b', module: 'm', tag: 'v1', asset: 'x-1-py3-none-any.whl', typed: 'a/b' })).toMatchObject({ tag: 'v1' });
    for (const bad of [{ tag: '../x' }, { asset: 'x.exe' }, { asset: '../x-1-py3-none-any.whl' }, { tag: 5 }]) {
      expect(() => parseWheelRequest({ owner: 'a', repo: 'b', module: 'm', tag: 'v1', asset: 'x-1-py3-none-any.whl', ...bad })).toThrow('not valid');
    }
  });
});
