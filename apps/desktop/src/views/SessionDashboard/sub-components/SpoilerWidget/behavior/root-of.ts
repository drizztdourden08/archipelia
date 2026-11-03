/* @layer renderer-app @kind logic */
import type { SpoilerGroup } from '@archipelia/design';
import type { SpoilerLog } from '@archipelia/sessions/spoiler';
import type { GroupBy, SpoilerEntry, SpoilerTab } from '../SpoilerWidget.type';
import { entrancesOf } from './entrances-of';
import { groupsOf } from './groups-of';
import { pathsOf } from './paths-of';
import { playthroughOf } from './playthrough-of';

type RootSource = { log: SpoilerLog; entries: readonly SpoilerEntry[]; shown: readonly SpoilerEntry[]; by: GroupBy };

const rootOf = (tab: SpoilerTab, { log, entries, shown, by }: RootSource): SpoilerGroup | null => {
  switch (tab) {
    case 'placements': return groupsOf(shown, by);
    case 'playthrough': return playthroughOf(log.spheres, entries);
    case 'entrances': return entrancesOf(log.entrances);
    case 'paths': return pathsOf(log.paths);
    default: return null;
  }
};

export { rootOf };
