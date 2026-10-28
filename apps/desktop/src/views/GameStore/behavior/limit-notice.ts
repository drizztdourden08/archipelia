/* @layer renderer-app @kind logic */
import type { CatalogView } from '@archipelia/catalog';
import { MINUTE_MS } from './limit-notice.constants';

const timeOf = (at: number) => new Date(at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const minutesText = (until: number, now: number) => {
  const minutes = Math.max(1, Math.ceil((until - now) / MINUTE_MS));
  return minutes === 1 ? '1 minute' : `${minutes} minutes`;
};

const limitNotice = (limited: CatalogView['limited'], now: number): string | undefined =>
  limited === undefined
    ? undefined
    : `GitHub is limiting requests. Showing the list from ${timeOf(limited.listedAt)}. Try again in ${minutesText(limited.limitedUntil, now)}.`;

export { limitNotice };
