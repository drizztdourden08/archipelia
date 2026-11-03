/* @layer renderer-app @kind logic */
import type { GroupBucket, GroupBy, SpoilerEntry } from '../SpoilerWidget.type';
import { bucketOf } from './bucket-of';

const compareRank = (a: GroupBucket, b: GroupBucket): number => {
  if (typeof a.rank === 'number' && typeof b.rank === 'number') return a.rank - b.rank;
  return String(a.rank).localeCompare(String(b.rank), undefined, { numeric: true });
};

const bucketsOf = (entries: readonly SpoilerEntry[], by: GroupBy): GroupBucket[] => {
  const buckets = new Map<string, GroupBucket>();
  entries.forEach((entry) => {
    const { label, rank } = bucketOf(entry, by);
    const bucket = buckets.get(label) ?? { label, rank, entries: [] };
    bucket.entries.push(entry);
    buckets.set(label, bucket);
  });
  return [...buckets.values()].sort(compareRank);
};

export { bucketsOf };
