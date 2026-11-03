/* @layer renderer-app @kind logic */
import type { SpoilerGroup } from '@archipelia/design';
import type { GroupBy, SpoilerEntry } from '../SpoilerWidget.type';
import { bucketsOf } from './buckets-of';
import { countsOf } from './counts-of';
import { groupOf } from './group-of';

const groupsOf = (entries: readonly SpoilerEntry[], by: GroupBy): SpoilerGroup => ({
  key: 'root',
  label: '',
  counts: countsOf(entries),
  rows: [],
  children: bucketsOf(entries, by).map(({ label, entries: members }) => groupOf(`${by}:${label}`, label, members)),
});

export { groupsOf };
