/* @layer renderer-app @kind logic */
import type { LiveTab } from './live.type';

const moveTab = (tabs: readonly LiveTab[], from: number, to: number): LiveTab[] => {
  const moved = tabs[from];
  if (!moved || to < 0 || to >= tabs.length) return [...tabs];
  const rest = tabs.filter((_, index) => index !== from);
  return [...rest.slice(0, to), moved, ...rest.slice(to)];
};

export { moveTab };
