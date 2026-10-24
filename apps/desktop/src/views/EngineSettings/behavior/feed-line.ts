/* @layer renderer-app @kind logic */
import type { VersionFeed } from '@archipelia/model';
import type { WhenText } from '../EngineSettings.type';

const feedLine = (feed: VersionFeed, when: WhenText): string =>
  (feed.checkedAt === undefined ? 'Never checked. Only the installed engines are listed.' : `Checked ${when(feed.checkedAt, 'ago')}.`);

export { feedLine };
