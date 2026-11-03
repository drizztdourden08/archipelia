/* @layer renderer-app @kind logic */
import type { SpoilerGroup } from '@archipelia/design';
import type { SpoilerEntry } from '../SpoilerWidget.type';
import { countsOf } from './counts-of';
import { rowOf } from './row-of';

const SHARED_AREA = 2;

const areasOf = (entries: readonly SpoilerEntry[]): Map<string, SpoilerEntry[]> => {
  const byArea = new Map<string, SpoilerEntry[]>();
  entries.forEach((entry) => {
    if (entry.area) byArea.set(entry.area, [...(byArea.get(entry.area) ?? []), entry]);
  });
  return new Map([...byArea].filter(([, members]) => members.length >= SHARED_AREA));
};

const groupOf = (key: string, label: string, entries: readonly SpoilerEntry[]): SpoilerGroup => {
  const areas = areasOf(entries);
  const loose = entries.filter((entry) => !entry.area || !areas.has(entry.area));
  return {
    key,
    label,
    counts: countsOf(entries),
    rows: loose.map((entry) => rowOf(entry, null)),
    children: [...areas].sort(([a], [b]) => a.localeCompare(b)).map(([area, members]) => ({
      key: `${key}/${area}`,
      label: area,
      counts: countsOf(members),
      rows: members.map((entry) => rowOf(entry, area)),
      children: [],
    })),
  };
};

export { groupOf };
