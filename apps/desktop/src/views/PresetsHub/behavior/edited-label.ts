/* @layer renderer-app @kind logic */
import { DAY_MS, RECENT_DAYS } from '../PresetsHub.constants';

const startOfDay = (time: number) => {
  const date = new Date(time);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

const editedLabel = (updatedAt: number, now: number) => {
  const days = Math.round((startOfDay(now) - startOfDay(updatedAt)) / DAY_MS);
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < RECENT_DAYS) return `${days} days ago`;
  return new Date(updatedAt).toLocaleDateString();
};

export { editedLabel };
