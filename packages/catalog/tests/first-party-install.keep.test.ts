/* @layer tests @kind test */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { CatalogEntry, DataFiles } from '@archipelia/model';
import { parseRegistry } from '@archipelia/trust';
import { createWorldFetch } from './first-party-world.fixtures';
import { BUNDLE_URL, WORLD_URL, communityEntry, json, missing, registryOf, sha256Of, worldBytes } from './first-party.fixtures';

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

const committed = () => (commit.mock.calls[0]?.[0] ?? {}) as { source?: string; trust?: { state: string; detail: string }; hash?: { verified: boolean } };

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
