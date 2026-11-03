/* @layer renderer-app @kind logic */
import type { SpoilerGroup } from '@archipelia/design';
import type { SpoilerSphere } from '@archipelia/sessions/spoiler';
import type { SpoilerEntry } from '../SpoilerWidget.type';
import { countsOf } from './counts-of';
import { rowOf } from './row-of';
import { sphereLabelOf } from './sphere-label-of';

const playthroughOf = (spheres: readonly SpoilerSphere[], entries: readonly SpoilerEntry[]): SpoilerGroup => {
  const byId = new Map(entries.map((entry) => [entry.placement.id, entry]));
  const children = spheres.map((sphere): SpoilerGroup => {
    const members = sphere.placements.flatMap((placement) => byId.get(placement.id) ?? []);
    return { key: `sphere:${sphere.index}`, label: sphereLabelOf(sphere.index), counts: countsOf(members), rows: members.map((entry) => rowOf(entry, null)), children: [] };
  });
  return { key: 'root', label: '', counts: countsOf(entries.filter(({ placement }) => placement.required)), rows: [], children };
};

export { playthroughOf };
