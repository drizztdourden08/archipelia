/* @layer renderer-app @kind logic */
import type { SpoilerTrackerStat } from '@archipelia/design';
import type { SpoilerLog } from '@archipelia/sessions/spoiler';

const statsOf = (log: SpoilerLog): SpoilerTrackerStat[] => [
  { key: 'total', label: 'placements', value: log.placements.length, icon: 'list' },
  { key: 'required', label: 'required', value: log.placements.filter(({ required }) => required).length, icon: 'star', title: 'Placements in the playthrough' },
  { key: 'others', label: 'to other worlds', value: log.placements.filter(({ finder, receiver }) => finder !== receiver).length, icon: 'send' },
  { key: 'spheres', label: 'spheres', value: log.spheres.length, icon: 'layers' },
  { key: 'players', label: 'players', value: log.players.length, icon: 'users' },
];

export { statsOf };
