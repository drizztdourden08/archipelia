/* @layer core @kind logic */
import type { HostLogLine } from '@archipelia/hosts';
import { JOINED, LEFT, NOTICE, WATCHER_TAGS } from '../live-room/online-from-log.constants';
import type { SeenSpan } from './run-end.type';

const seenFromLog = (lines: readonly HostLogLine[]): Record<string, SeenSpan> => {
  const spans: Record<string, SeenSpan> = {};
  const touch = (raw: string, at: number) => {
    const name = raw.replace(NOTICE, '').trim();
    spans[name] = { first: spans[name]?.first ?? at, last: at };
  };
  lines.forEach(({ at, text }) => {
    const [, joined] = JOINED.exec(text) ?? [];
    if (joined !== undefined) {
      touch(joined, at);
      return;
    }
    const [, left, tags] = LEFT.exec(text) ?? [];
    if (left !== undefined && tags !== undefined && !WATCHER_TAGS.test(tags)) touch(left, at);
  });
  return spans;
};

export { seenFromLog };
