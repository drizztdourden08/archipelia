/* @layer core @kind logic */
import { JOINED, LEFT, NOTICE, WATCHER_TAGS } from './online-from-log.constants';

const nameOf = (raw: string) => raw.replace(NOTICE, '').trim();

const clientEventOf = (line: string): { name: string; delta: number } | undefined => {
  const [, joined] = JOINED.exec(line) ?? [];
  if (joined !== undefined) return { name: nameOf(joined), delta: 1 };
  const [, left, tags] = LEFT.exec(line) ?? [];
  if (left === undefined || tags === undefined || WATCHER_TAGS.test(tags)) return undefined;
  return { name: nameOf(left), delta: -1 };
};

export { clientEventOf };
