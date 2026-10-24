/* @layer core @kind logic */
import type { BrowseHandle } from './browse.type';

const noOpBrowser = (): BrowseHandle => ({
  active: false,
  list: () => [],
  refresh: () => undefined,
  stop: () => Promise.resolve(),
});

export { noOpBrowser };
