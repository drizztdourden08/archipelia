/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { pickWheel } from '../src/wheel/pick-wheel';
import { releasesOf } from '../src/wheel/releases-of';
import { assetJson, releaseJson, sha256Of, TAGS, wheelBytes } from './wheel.fixtures';

const BYTES = wheelBytes();

const asset = (name: string, digest = true) => assetJson(name, BYTES, digest);

const pick = (releases: unknown[], names = ['ctrando']) => pickWheel(releasesOf(releases), TAGS, names);

describe('picking the wheel of a release for this engine', () => {
  test('K1 takes the build for this exact Python and platform from the newest stable release', { tags: ['critical'] }, () => {
    const found = pick([
      releaseJson('v1.2.0', [asset('ctrando-1.2.0-cp311-cp311-win_amd64.whl'), asset('ctrando-1.2.0-cp312-cp312-win_amd64.whl'), asset('ctrando-1.2.0.tar.gz')]),
      releaseJson('v1.1.0', [asset('ctrando-1.1.0-cp312-cp312-win_amd64.whl')]),
    ]);
    expect(found).toMatchObject({ tag: 'v1.2.0', asset: 'ctrando-1.2.0-cp312-cp312-win_amd64.whl', fit: 'exact' });
    expect(found?.digest).toMatch(/^[0-9a-f]{64}$/);
    expect(found?.newest).toBeUndefined();
  });

  test('K1 prefers an exact build over a stable ABI build over a pure Python wheel in the same release', { tags: ['critical'] }, () => {
    const assets = [asset('ctrando-1.2.0-py3-none-any.whl'), asset('ctrando-1.2.0-cp311-abi3-win_amd64.whl'), asset('ctrando-1.2.0-cp312-cp312-win_amd64.whl')];
    expect(pick([releaseJson('v1', assets)])?.fit).toBe('exact');
    expect(pick([releaseJson('v1', assets.slice(0, 2))])?.fit).toBe('abi3');
    expect(pick([releaseJson('v1', assets.slice(0, 1))])?.fit).toBe('pure');
  });

  test('K1 takes a pure Python wheel when no binary build fits', { tags: ['critical'] }, () => {
    expect(pick([releaseJson('v1', [asset('ctrando-1.2.0-cp313-cp313-win_amd64.whl'), asset('ctrando-1.2.0-py2.py3-none-any.whl')])])).toMatchObject({
      asset: 'ctrando-1.2.0-py2.py3-none-any.whl', fit: 'pure',
    });
  });

  test('K1 has no pick when no wheel fits this Python or this platform, and says so with nothing', { tags: ['critical'] }, () => {
    expect(pick([releaseJson('v1', [asset('ctrando-1.2.0-cp313-cp313-win_amd64.whl'), asset('ctrando-1.2.0-cp312-cp312-manylinux_2_17_x86_64.whl')])])).toBeUndefined();
    expect(pick([releaseJson('v1', [asset('ctrando-1.2.0.tar.gz'), asset('notes.txt')])])).toBeUndefined();
    expect(pick([releaseJson('v1', [])])).toBeUndefined();
    expect(pick([])).toBeUndefined();
  });

  test('K1 goes back to an older stable release when the newest has no build that fits', { tags: ['critical'] }, () => {
    const found = pick([
      releaseJson('v2.0.0', [asset('ctrando-2.0.0-cp313-cp313-win_amd64.whl')]),
      releaseJson('v1.9.0', [asset('ctrando-1.9.0-cp312-cp312-win_amd64.whl')]),
    ]);
    expect(found).toMatchObject({ tag: 'v1.9.0', newest: 'v2.0.0' });
  });

  test('K1 skips prereleases while a stable release exists, and uses them when none does', { tags: ['critical'] }, () => {
    const preview = releaseJson('v2.0.0-rc1', [asset('ctrando-2.0.0rc1-cp312-cp312-win_amd64.whl')], { prerelease: true });
    const stable = releaseJson('v1.0.0', [asset('ctrando-1.0.0-cp313-cp313-win_amd64.whl')]);
    expect(pick([preview, stable])).toBeUndefined();
    expect(pick([preview])?.tag).toBe('v2.0.0-rc1');
    expect(pick([releaseJson('v1', [asset('ctrando-1.0-cp312-cp312-win_amd64.whl')]), preview])?.tag).toBe('v1');
  });

  test('K1 never uses a draft', { tags: ['critical'] }, () => {
    expect(pick([releaseJson('v1', [asset('ctrando-1.2.0-cp312-cp312-win_amd64.whl')], { draft: true })])).toBeUndefined();
  });

  test('K1 takes only wheels of the package that was asked for, however its name is spelled', { tags: ['critical'] }, () => {
    const releases = [releaseJson('v1', [asset('other_tool-1.0-py3-none-any.whl'), asset('CT_Rando-1.0-py3-none-any.whl')])];
    expect(pick(releases)).toBeUndefined();
    expect(pick(releases, ['ct-rando'])?.asset).toBe('CT_Rando-1.0-py3-none-any.whl');
  });
});

describe('what is kept from a release listing', () => {
  test('K1 keeps only the tag, the file name, the size and the digest, never an address or text', { tags: ['critical'] }, () => {
    const [release] = releasesOf([releaseJson('v1', [asset('ctrando-1.2.0-py3-none-any.whl')])]);
    expect(release).toEqual({
      tag: 'v1', prerelease: false, assets: [{ name: 'ctrando-1.2.0-py3-none-any.whl', size: BYTES.length, digest: sha256Of(BYTES) }],
    });
  });

  test('K1 drops files that are not safe wheel names, not uploaded, empty or too big, and reads a missing digest as none', { tags: ['critical'] }, () => {
    const [release] = releasesOf([releaseJson('v1', [
      { name: '../x-1-py3-none-any.whl', size: 5, state: 'uploaded' },
      { name: 'a-1-py3-none-any.whl', size: 5, state: 'starter' },
      { name: 'b-1-py3-none-any.whl', size: 0, state: 'uploaded' },
      { name: 'c-1-py3-none-any.whl', size: 900 * 1024 * 1024, state: 'uploaded' },
      { name: 'd-1-py3-none-any.whl', size: 5, state: 'uploaded', digest: 'md5:abc' },
    ])]);
    expect(release?.assets).toEqual([{ name: 'd-1-py3-none-any.whl', size: 5, digest: undefined }]);
  });
});
