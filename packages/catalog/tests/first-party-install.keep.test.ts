/* @layer tests @kind test */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { CatalogEntry, DataFiles } from '@archipelia/model';
import { parseRegistry } from '@archipelia/trust';
import { createWorldFetch } from './first-party-world.fixtures';
import { BUNDLE_URL, WORLD_URL, buildBundleUrl, buildUrl, bytesResponse, communityEntry, json, missing, registryOf, sha256Of, worldBytes } from './first-party.fixtures';

const apVersion = vi.hoisted(() => ({ value: '0.6.7' }));
const verify = vi.hoisted(() => vi.fn());
const commit = vi.hoisted(() => vi.fn((job: unknown) => Promise.resolve(job)));

vi.mock('@archipelia/engine', async (original) => ({
  ...(await original<object>()),
  readRuntime: () => Promise.resolve({ apVersion: apVersion.value }),
}));
vi.mock('@archipelia/trust', async (original) => ({ ...(await original<object>()), verifyWorld: verify }));
vi.mock('../src/install/commit-install', () => ({ commitInstall: commit }));

const { installWorld } = await import('../src/install/install-world');

const files = {} as DataFiles;

const bytes = worldBytes();

const client = (status: 'active' | 'revoked' = 'active') => {
  const parsed = parseRegistry(registryOf(status));
  const found = parsed.ok ? parsed.registry.clients[0] : undefined;
  if (!found) throw new Error('fixture registry is invalid');
  return found;
};

const entryOf = (patch: Partial<CatalogEntry> = {}): CatalogEntry => communityEntry('relic_of_the_past', {
  game: 'Relic of the Past',
  displayName: 'Relic of the Past',
  source: 'first-party',
  stability: 'unknown',
  versions: [{ version: '0.1.0', url: WORLD_URL, sha256: sha256Of(bytes) }],
  firstParty: { client: 'relic-of-the-past', bundleUrl: BUNDLE_URL, minimumAp: '0.6.4' },
  ...patch,
});

const trustWith = (status: 'active' | 'revoked' = 'active') => ({ clients: [client(status)], root: () => Promise.resolve({} as never) });

const install = (patch: Partial<CatalogEntry>, routes: Parameters<typeof createWorldFetch>[1], status: 'active' | 'revoked' = 'active') =>
  installWorld({
    engineDir: '', files, entry: entryOf(patch), version: '0.1.0', fetch: createWorldFetch(bytes, routes), trust: trustWith(status),
  });

const committed = () => (commit.mock.calls[0]?.[0] ?? {}) as { source?: string; trust?: { state: string; detail: string }; hash?: { verified: boolean }; origin?: unknown };

beforeEach(() => {
  apVersion.value = '0.6.7';
  verify.mockReset();
  commit.mockClear();
});

describe('installing a first-party release', () => {
  test('verified: the attestation passes and the record is marked first-party and verified', async () => {
    verify.mockReturnValue({ ok: true, sha256: sha256Of(bytes), game: 'Relic of the Past', signer: { identity: 'i', repo: 'drizztdourden08/relic-of-the-past', workflow: '.github/workflows/release.yml', ref: 'refs/heads/main' } });
    await install({}, { [BUNDLE_URL]: () => json({ mediaType: 'bundle' }) });
    expect(verify).toHaveBeenCalledOnce();
    expect(committed()).toMatchObject({ source: 'first-party', hash: { verified: true }, trust: { state: 'verified' } });
    expect(committed().trust?.detail).toContain('drizztdourden08/relic-of-the-past');
  });

  test('unverified: a release without a bundle still installs, with a not verified yet line', async () => {
    await install({}, { [BUNDLE_URL]: missing });
    expect(verify).not.toHaveBeenCalled();
    expect(committed()).toMatchObject({ source: 'first-party', trust: { state: 'unverified' } });
    expect(committed().trust?.detail).toContain('Not verified yet');
  });

  test('a tampered asset is refused with the reason and nothing is installed', async () => {
    verify.mockReturnValue({ ok: false, code: 'trust-failed', reason: 'digest-mismatch', detail: 'the bundle attests a different file' });
    await expect(install({}, { [BUNDLE_URL]: () => json({ mediaType: 'bundle' }) })).rejects.toThrow(/Relic of the Past is refused: the bundle attests a different file/);
    expect(commit).not.toHaveBeenCalled();
  });

  test('a changed file fails the manifest checksum before the attestation is read', async () => {
    const other = entryOf({ versions: [{ version: '0.1.0', url: WORLD_URL, sha256: 'f'.repeat(64) }] });
    await expect(installWorld({
      engineDir: '', files, entry: other, version: '0.1.0', fetch: createWorldFetch(bytes, { [BUNDLE_URL]: missing }), trust: trustWith(),
    })).rejects.toThrow(/sha256/);
    expect(commit).not.toHaveBeenCalled();
  });

  test('a revoked client is refused even without a bundle', async () => {
    await expect(install({}, { [BUNDLE_URL]: missing }, 'revoked')).rejects.toThrow(/revoked in the registry/);
    expect(commit).not.toHaveBeenCalled();
  });

  test('no release: the install says No release yet', async () => {
    await expect(install({ versions: [], unavailable: 'No release yet' }, {})).rejects.toThrow('Relic of the Past: No release yet');
  });

  test('version fit: an engine older than the minimum is refused with the reason', async () => {
    apVersion.value = '0.6.2';
    await expect(install({}, { [BUNDLE_URL]: missing })).rejects.toThrow(/Needs Archipelago 0.6.4 or newer, the active engine is 0.6.2/);
    expect(commit).not.toHaveBeenCalled();
  });

  test('a community install is not vetted and stays an index install', async () => {
    const community = communityEntry('alpha', { versions: [{ version: '1.0.0', url: WORLD_URL, sha256: sha256Of(bytes) }] });
    await installWorld({ engineDir: '', files, entry: community, version: '1.0.0', fetch: createWorldFetch(bytes, {}) });
    expect(committed()).toMatchObject({ source: 'index' });
    expect(committed().trust).toBeUndefined();
  });
});

const at665 = worldBytes('ap 0.6.5');
const at667 = worldBytes('ap 0.6.7');

const buildOf = (ap: string, bytes: Uint8Array, patch: Record<string, unknown> = {}) => ({
  archipelagoVersion: ap, url: buildUrl(ap), bundleUrl: buildBundleUrl(ap), sha256: sha256Of(bytes), size: bytes.length, ...patch,
});

const buildsEntry = (builds = [buildOf('0.6.5', at665), buildOf('0.6.7', at667)]): CatalogEntry => entryOf({
  versions: [],
  firstParty: { client: 'relic-of-the-past', bundleUrl: BUNDLE_URL, minimumAp: '0.6.5', maximumAp: '0.6.7', worldVersion: '0.1.0', builds },
});

const installBuild = (entry: CatalogEntry, routes: Record<string, () => Response>) =>
  installWorld({
    engineDir: '', files, entry, version: '0.1.0', trust: trustWith(),
    fetch: createWorldFetch(bytes, { [buildUrl('0.6.5')]: () => bytesResponse(at665), [buildUrl('0.6.7')]: () => bytesResponse(at667), ...routes }),
  });

describe('installing a per-version build', () => {
  test('installs the build for the engine version and verifies that build own bundle', async () => {
    apVersion.value = '0.6.5';
    verify.mockReturnValue({ ok: true, sha256: sha256Of(at665), game: 'Relic of the Past', signer: { identity: 'i', repo: 'drizztdourden08/relic-of-the-past', workflow: 'w', ref: 'r' } });
    await installBuild(buildsEntry(), { [buildBundleUrl('0.6.5')]: () => json({ mediaType: 'bundle' }) });
    expect(verify).toHaveBeenCalledOnce();
    expect(verify.mock.calls[0]?.[0]).toEqual(at665);
    expect(committed()).toMatchObject({ source: 'first-party', hash: { verified: true }, trust: { state: 'verified' } });
  });

  test('a build with no bundle of its own installs as not verified yet, even if another build has one', async () => {
    apVersion.value = '0.6.7';
    await installBuild(buildsEntry(), { [buildBundleUrl('0.6.5')]: () => json({ mediaType: 'bundle' }), [buildBundleUrl('0.6.7')]: missing });
    expect(verify).not.toHaveBeenCalled();
    expect(committed()).toMatchObject({ trust: { state: 'unverified' } });
    expect(committed().trust?.detail).toContain('Not verified yet');
  });

  test('no build for the engine version is refused with the list of builds', async () => {
    apVersion.value = '0.6.6';
    await expect(installBuild(buildsEntry(), {})).rejects.toThrow('No Relic of the Past build for Archipelago 0.6.6; builds exist for 0.6.5, 0.6.7');
    expect(commit).not.toHaveBeenCalled();
  });

  test('a build whose size differs from the index is refused before anything is installed', async () => {
    apVersion.value = '0.6.7';
    const entry = buildsEntry([buildOf('0.6.7', at667, { size: at667.length + 1 })]);
    await expect(installBuild(entry, { [buildBundleUrl('0.6.7')]: missing })).rejects.toThrow(/size is \d+ bytes, the release says/);
    expect(commit).not.toHaveBeenCalled();
  });

  test('a build whose checksum differs from the index is refused', async () => {
    apVersion.value = '0.6.7';
    const entry = buildsEntry([buildOf('0.6.7', at667, { sha256: 'e'.repeat(64) })]);
    await expect(installBuild(entry, { [buildBundleUrl('0.6.7')]: missing })).rejects.toThrow(/sha256/);
    expect(commit).not.toHaveBeenCalled();
  });

  test('a tampered build is refused with the reason', async () => {
    apVersion.value = '0.6.7';
    verify.mockReturnValue({ ok: false, code: 'trust-failed', reason: 'digest-mismatch', detail: 'the bundle attests a different file' });
    await expect(installBuild(buildsEntry(), { [buildBundleUrl('0.6.7')]: () => json({ mediaType: 'bundle' }) })).rejects.toThrow(/is refused: the bundle attests a different file/);
    expect(commit).not.toHaveBeenCalled();
  });
});

const topicOf = (patch: Partial<CatalogEntry> = {}) => entryOf({
  firstParty: { repo: 'maker/star-quest', bundleUrl: BUNDLE_URL },
  discovered: { repoId: 7, repo: 'maker/star-quest', owner: 'maker', stars: 3, pushedAt: '', createdAt: '', direct: false },
  ...patch,
});

const installTopic = (patch: Partial<CatalogEntry> = {}) =>
  installWorld({ engineDir: '', files, entry: topicOf(patch), version: '0.1.0', fetch: createWorldFetch(bytes, {}) });

describe('installing a world found by its topic', () => {
  test('is recorded as not reviewed, with the repository it came from, and no signature is asked for', async () => {
    await installTopic();
    expect(verify).not.toHaveBeenCalled();
    expect(committed()).toMatchObject({
      source: 'first-party',
      trust: { state: 'unverified', detail: 'Not reviewed: maker/star-quest' },
      origin: { repoId: 7, repo: 'maker/star-quest' },
    });
  });

  test('is refused when the apworld holds another world than the release lists', async () => {
    await expect(installTopic({ apworld: 'other_world' })).rejects.toThrow(/holds the world relic_of_the_past, the release lists other_world/);
    expect(commit).not.toHaveBeenCalled();
  });

  test('is refused when the apworld names another game than the release lists', async () => {
    await expect(installTopic({ game: 'Another Game' })).rejects.toThrow(/names the game Relic of the Past, the release lists Another Game/);
    expect(commit).not.toHaveBeenCalled();
  });
});
