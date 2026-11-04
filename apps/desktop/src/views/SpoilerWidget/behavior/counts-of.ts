/* @layer renderer-app @kind logic */
import type { SpoilerCount } from '@archipelia/design';
import type { SpoilerEntry } from '../SpoilerWidget.type';

const countsOf = (entries: readonly SpoilerEntry[]): SpoilerCount[] => [
  { key: 'total', value: entries.length, label: 'total' },
  { key: 'required', value: entries.filter(({ placement }) => placement.required).length, label: 'required' },
  { key: 'others', value: entries.filter(({ placement }) => placement.finder !== placement.receiver).length, label: 'to others' },
];

export { countsOf };
