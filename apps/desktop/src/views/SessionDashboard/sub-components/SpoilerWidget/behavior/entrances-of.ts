/* @layer renderer-app @kind logic */
import type { SpoilerGroup } from '@archipelia/design';
import type { SpoilerEntrance } from '@archipelia/sessions/spoiler';
import { listCount } from './list-count';

const ALL_WORLDS = 'All worlds';

const entrancesOf = (entrances: readonly SpoilerEntrance[]): SpoilerGroup => {
  const byPlayer = new Map<string, SpoilerEntrance[]>();
  entrances.forEach((entrance) => {
    const name = entrance.player ?? ALL_WORLDS;
    byPlayer.set(name, [...(byPlayer.get(name) ?? []), entrance]);
  });
  const children = [...byPlayer].map(([name, members]): SpoilerGroup => ({
    key: `entrances:${name}`,
    label: name,
    counts: listCount(members.length, 'entrances'),
    rows: members.map(({ entrance, exit, direction }, index) => ({ id: `${name}:${index}`, primary: entrance, secondary: exit, detail: `${entrance} ${direction} ${exit}` })),
    children: [],
  }));
  return { key: 'root', label: '', counts: listCount(entrances.length, 'entrances'), rows: [], children };
};

export { entrancesOf };
