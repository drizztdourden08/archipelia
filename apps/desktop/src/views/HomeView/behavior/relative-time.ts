/* @layer renderer-app @kind logic */
import { DAY, HOUR, MINUTE } from '../HomeView.constants';

const relativeTime = (at: number, now: number) => {
  const elapsed = Math.max(0, now - at);
  if (elapsed < MINUTE) return 'just now';
  if (elapsed < HOUR) return `${Math.floor(elapsed / MINUTE)} min ago`;
  if (elapsed < DAY) return `${Math.floor(elapsed / HOUR)} h ago`;
  return `${Math.floor(elapsed / DAY)} d ago`;
};

export { relativeTime };
