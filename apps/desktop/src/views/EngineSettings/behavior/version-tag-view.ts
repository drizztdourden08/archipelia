/* @layer renderer-app @kind logic */
import type { VersionFeed, VersionTag } from '@archipelia/model';
import { TAG_VIEW } from '../EngineSettings.constants';
import type { TagView, WhenText } from '../EngineSettings.type';

const versionTagView = (tag: VersionTag, feed: VersionFeed, when: WhenText): TagView => {
  const view = TAG_VIEW[tag];
  const asOf = tag === 'up-to-date' && feed.state !== 'fresh' ? feed.checkedAt : undefined;
  return asOf === undefined ? view : { ...view, title: `As of ${when(asOf, 'day')}` };
};

export { versionTagView };
