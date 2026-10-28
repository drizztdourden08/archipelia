/* @layer renderer-app @kind logic */
import type { LiveTab } from './live.type';

const mergeTabs = (shown: readonly LiveTab[], incoming: readonly LiveTab[]): LiveTab[] => {
  const fresh = new Map(incoming.map((tab) => [tab.tabId, tab]));
  const kept = shown.flatMap((tab) => fresh.get(tab.tabId) ?? []);
  const known = new Set(shown.map((tab) => tab.tabId));
  return [...kept, ...incoming.filter((tab) => !known.has(tab.tabId))];
};

export { mergeTabs };
