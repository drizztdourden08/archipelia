/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import type { VersionFeed } from '@archipelia/model';
import { fetchTagCommit, versionTag } from '../../src';
import { fakeFetch } from './fake-fetch';

const release = (version: string) => ({ version, tag: version, publishedAt: '', notesUrl: '' });

const python = (version: string, pinned?: boolean) => ({ version, release: '1', target: 'win32-x64', file: 'f', sha256: 'a', ...(pinned ? { pinned } : {}) });

const feed = (patch: Partial<VersionFeed>): VersionFeed => ({ state: 'fresh', releases: [], python: [], ...patch });

const ACTIVE = { ap: '0.6.7', python: '3.12.14' };

describe('versionTag', () => {
  test('a newer stable release is a new version', () => {
    expect(versionTag(feed({ releases: [release('0.6.8'), release('0.6.7')], python: [python('3.12.14')] }), ACTIVE)).toBe('new-version');
  });

  test('a newer build of the active Python line is a new version', () => {
    expect(versionTag(feed({ releases: [release('0.6.7')], python: [python('3.12.15')] }), ACTIVE)).toBe('new-version');
  });

  test('a newer build of another line is not', () => {
    expect(versionTag(feed({ releases: [release('0.6.7')], python: [python('3.13.17'), python('3.12.14')] }), ACTIVE)).toBe('up-to-date');
  });

  test('the same versions are up to date', () => {
    expect(versionTag(feed({ releases: [release('0.6.7')], python: [python('3.12.14')] }), ACTIVE)).toBe('up-to-date');
  });

  test('a cached feed still tags', () => {
    expect(versionTag(feed({ state: 'cached', releases: [release('0.6.7')] }), ACTIVE)).toBe('up-to-date');
  });

  test('a feed that never read anything is not checked', () => {
    expect(versionTag(feed({ state: 'never' }), ACTIVE)).toBe('not-checked');
    expect(versionTag(feed({ state: 'offline', python: [python('3.12.14', true)] }), ACTIVE)).toBe('not-checked');
  });

  test('no active engine is not checked', () => {
    expect(versionTag(feed({ releases: [release('0.6.8')] }), undefined)).toBe('not-checked');
  });
});

describe('fetchTagCommit', () => {
  const URL = 'https://api.github.com/repos/ArchipelagoMW/Archipelago/commits/0.6.8';

  test('asks for the bare sha and returns it', async () => {
    const fake = fakeFetch({ [URL]: { text: `${'c'.repeat(40)}\n` } });
    expect(await fetchTagCommit(fake.fetch, '0.6.8')).toBe('c'.repeat(40));
    expect(fake.calls[0]?.headers.accept).toBe('application/vnd.github.sha');
  });

  test('an answer that is not a sha is refused', async () => {
    await expect(fetchTagCommit(fakeFetch({ [URL]: { text: '<html>' } }).fetch, '0.6.8')).rejects.toThrow(/unexpected answer/);
  });

  test('an unknown tag is an error', async () => {
    await expect(fetchTagCommit(fakeFetch({}).fetch, '9.9.9')).rejects.toThrow(/HTTP 404/);
  });
});
