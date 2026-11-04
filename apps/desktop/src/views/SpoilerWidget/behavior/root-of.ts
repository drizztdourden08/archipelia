/* @layer renderer-app @kind logic */
import type { SpoilerGroup } from '@archipelia/design';
import type { RootSource, SpoilerTab } from '../SpoilerWidget.type';
import { entrancesOf } from './entrances-of';
import { groupsOf } from './groups-of';
import { pathsOf } from './paths-of';
import { playthroughOf } from './playthrough-of';

const rootOf = (tab: SpoilerTab, { log, entries, shown, by }: RootSource): SpoilerGroup | null => {
  switch (tab) {
    case 'placements': return groupsOf(shown, by);
    case 'playthrough': return playthroughOf(log.spheres, entries);
    case 'entrances': return entrancesOf(log.entrances);
    case 'paths': return pathsOf(log.paths);
    case 'settings':
    case 'raw': return null;
  }
};

export { rootOf };
