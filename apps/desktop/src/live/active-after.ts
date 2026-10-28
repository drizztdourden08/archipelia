/* @layer renderer-app @kind logic */
import type { LiveTab } from './live.type';

const activeAfter = (before: readonly LiveTab[], after: readonly LiveTab[], activeId: string | null): string | null => {
  if (activeId !== null && after.some((tab) => tab.tabId === activeId)) return activeId;
  const at = before.findIndex((tab) => tab.tabId === activeId);
  const left = before.slice(0, Math.max(at, 0)).reverse().find((tab) => after.some((entry) => entry.tabId === tab.tabId));
  return left?.tabId ?? after[0]?.tabId ?? null;
};

export { activeAfter };
