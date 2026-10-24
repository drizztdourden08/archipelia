/* @layer renderer-app @kind logic */
import type { VersionFeed } from '@archipelia/model';
import type { WhenText } from '../EngineSettings.type';

const kept = (feed: VersionFeed, when: WhenText): string =>
  (feed.checkedAt === undefined ? 'Only the installed engines are listed.' : `Showing the list from ${when(feed.checkedAt, 'day')}.`);

const feedNotice = (feed: VersionFeed, when: WhenText): string | undefined => {
  if (feed.state === 'offline') return `Could not reach GitHub. ${kept(feed, when)}`;
  if (feed.state !== 'rate-limited') return undefined;
  const retry = feed.retryAt === undefined ? '' : ` Try again after ${when(feed.retryAt, 'time')}.`;
  return `GitHub is limiting requests.${retry} ${kept(feed, when)}`;
};

export { feedNotice };
