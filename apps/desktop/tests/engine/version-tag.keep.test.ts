/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { feedLine } from '../../src/views/EngineSettings/behavior/feed-line';
import { feedNotice } from '../../src/views/EngineSettings/behavior/feed-notice';
import { versionTagView } from '../../src/views/EngineSettings/behavior/version-tag-view';
import { feedOf, when } from './engine-fixture';

describe('the version tag', () => {
  test('reads New version when a newer release exists', () => {
    expect(versionTagView('new-version', feedOf(), when)).toMatchObject({ label: 'New version', look: { color: 'info' } });
  });

  test('reads Up to date when the list is fresh', () => {
    const view = versionTagView('up-to-date', feedOf(), when);
    expect(view.label).toBe('Up to date');
    expect(view.title).toBeUndefined();
  });

  test('says as of when Up to date rests on a kept list', () => {
    const view = versionTagView('up-to-date', feedOf({ state: 'cached' }), when);
    expect(view.title).toBe('As of day:1760100000000');
  });

  test('reads Not checked when GitHub was never reached', () => {
    expect(versionTagView('not-checked', feedOf({ state: 'never', checkedAt: undefined }), when).label).toBe('Not checked');
  });
});

describe('the feed line', () => {
  test('says when the list was checked', () => {
    expect(feedLine(feedOf(), when)).toBe('Checked ago:1760100000000.');
  });

  test('says so when it never was', () => {
    expect(feedLine(feedOf({ state: 'never', checkedAt: undefined }), when)).toBe('Never checked. Only the installed engines are listed.');
  });
});

describe('the feed notice', () => {
  test('is absent while the list is fresh, kept or never read', () => {
    expect(feedNotice(feedOf(), when)).toBeUndefined();
    expect(feedNotice(feedOf({ state: 'cached' }), when)).toBeUndefined();
    expect(feedNotice(feedOf({ state: 'never', checkedAt: undefined }), when)).toBeUndefined();
  });

  test('says GitHub could not be reached and which list is shown', () => {
    expect(feedNotice(feedOf({ state: 'offline' }), when)).toBe('Could not reach GitHub. Showing the list from day:1760100000000.');
  });

  test('says when GitHub can be asked again', () => {
    const notice = feedNotice(feedOf({ state: 'rate-limited', retryAt: 1_760_200_000_000 }), when);
    expect(notice).toBe('GitHub is limiting requests. Try again after time:1760200000000. Showing the list from day:1760100000000.');
  });

  test('offline with no list at all', () => {
    const notice = feedNotice(feedOf({ state: 'offline', checkedAt: undefined, releases: [] }), when);
    expect(notice).toBe('Could not reach GitHub. Only the installed engines are listed.');
  });
});
