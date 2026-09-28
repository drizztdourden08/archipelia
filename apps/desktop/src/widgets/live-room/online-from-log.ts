/* @layer renderer-app @kind logic */
import { JOINED, LEFT, NOTICE, WATCHER_TAGS } from './online-from-log.constants';

const nameOf = (raw: string) => raw.replace(NOTICE, '').trim();

const onlineFromLog = (lines: readonly string[]): Record<string, boolean> => {
  const clients = new Map<string, number>();
  const shift = (raw: string, delta: number) => {
    const name = nameOf(raw);
    clients.set(name, Math.max(0, (clients.get(name) ?? 0) + delta));
  };
  lines.forEach((line) => {
    const [, joined] = JOINED.exec(line) ?? [];
    if (joined !== undefined) {
      shift(joined, 1);
      return;
    }
    const [, left, tags] = LEFT.exec(line) ?? [];
    if (left !== undefined && tags !== undefined && !WATCHER_TAGS.test(tags)) shift(left, -1);
  });
  return Object.fromEntries([...clients].map(([name, count]) => [name, count > 0]));
};

export { onlineFromLog };
