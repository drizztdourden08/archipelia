/* @layer tests @kind test */
import { TrustedRoot } from '@sigstore/protobuf-specs';
import { describe, expect, test, vi } from 'vitest';
import { loadTrustedRoot } from '../src/verify/load-trusted-root';
import { memoryFiles } from './memory-files';

const DAY = 24 * 3_600_000;

const root = TrustedRoot.fromJSON({
  mediaType: 'application/vnd.dev.sigstore.trustedroot+json;version=0.1',
  tlogs: [],
  ctlogs: [],
  certificateAuthorities: [],
  timestampAuthorities: [],
});

describe('loadTrustedRoot', () => {
  test('fetches through TUF into the sigstore cache folder and keeps a copy', async () => {
    const files = memoryFiles();
    const fetchRoot = vi.fn(() => Promise.resolve(root));
    const load = await loadTrustedRoot({ files, fetchRoot, now: () => 1000 });
    expect(load).toMatchObject({ source: 'tuf', refreshedAt: 1000, problems: [] });
    expect(fetchRoot).toHaveBeenCalledWith('/memory/sigstore/tuf');
    expect(files.store.get('sigstore/trusted-root.json')).toMatchObject({ refreshedAt: 1000 });
  });

  test('serves the copy for a day, with no request', async () => {
    const files = memoryFiles();
    await loadTrustedRoot({ files, fetchRoot: () => Promise.resolve(root), now: () => 1000 });
    const fetchRoot = vi.fn();
    const load = await loadTrustedRoot({ files, fetchRoot, now: () => 1000 + DAY - 1 });
    expect(load.source).toBe('cache');
    expect(fetchRoot).not.toHaveBeenCalled();
  });

  test('refreshes after a day', async () => {
    const files = memoryFiles();
    await loadTrustedRoot({ files, fetchRoot: () => Promise.resolve(root), now: () => 1000 });
    const fetchRoot = vi.fn(() => Promise.resolve(root));
    const load = await loadTrustedRoot({ files, fetchRoot, now: () => 1000 + DAY });
    expect(load).toMatchObject({ source: 'tuf', refreshedAt: 1000 + DAY });
  });

  test('keeps the last good copy when the refresh fails', async () => {
    const files = memoryFiles();
    await loadTrustedRoot({ files, fetchRoot: () => Promise.resolve(root), now: () => 1000 });
    const load = await loadTrustedRoot({ files, fetchRoot: () => Promise.reject(new Error('offline')), now: () => 1000 + 9 * DAY });
    expect(load).toMatchObject({ source: 'cache', refreshedAt: 1000, problems: ['offline'] });
  });

  test('throws with nothing cached and no network', async () => {
    await expect(loadTrustedRoot({ files: memoryFiles(), fetchRoot: () => Promise.reject(new Error('offline')) })).rejects.toThrow(
      'not cached',
    );
  });

  test('force refreshes inside the day', async () => {
    const files = memoryFiles();
    await loadTrustedRoot({ files, fetchRoot: () => Promise.resolve(root), now: () => 1000 });
    const fetchRoot = vi.fn(() => Promise.resolve(root));
    await loadTrustedRoot({ files, fetchRoot, now: () => 2000 }, { force: true });
    expect(fetchRoot).toHaveBeenCalledTimes(1);
  });
});
