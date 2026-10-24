/* @layer core @kind logic */
import type { ApRelease } from '@archipelia/model';
import { isRecord } from '@archipelia/model';
import { compareVersions } from './compare-versions';
import { STABLE_TAG } from './feed-sources.constants';

const toRelease = (item: unknown): ApRelease[] => {
  if (!isRecord(item) || item.draft === true || item.prerelease !== false) return [];
  const { tag_name: tag, published_at: publishedAt, html_url: notesUrl } = item;
  if (typeof tag !== 'string' || !STABLE_TAG.test(tag)) return [];
  return [{
    version: tag,
    tag,
    publishedAt: typeof publishedAt === 'string' ? publishedAt : '',
    notesUrl: typeof notesUrl === 'string' ? notesUrl : '',
  }];
};

const parseReleases = (items: unknown[]): ApRelease[] =>
  items.flatMap(toRelease).sort((a, b) => compareVersions(b.version, a.version));

export { parseReleases };
