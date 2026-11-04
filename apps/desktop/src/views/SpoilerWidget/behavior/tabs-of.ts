/* @layer renderer-app @kind logic */
import type { TabItem } from '@drizztdourden08/tessera/primitives';
import type { SpoilerLog } from '@archipelia/sessions/spoiler';

const tabsOf = (log: SpoilerLog, shown: number): TabItem[] => {
  const tabs: TabItem[] = [
    { id: 'placements', label: 'Placements', badge: shown },
    { id: 'playthrough', label: 'Playthrough', badge: log.spheres.length },
  ];
  if (log.entrances.length > 0) tabs.push({ id: 'entrances', label: 'Entrances', badge: log.entrances.length });
  if (log.paths.length > 0) tabs.push({ id: 'paths', label: 'Paths', badge: log.paths.length });
  tabs.push({ id: 'settings', label: 'Settings' }, { id: 'raw', label: 'Raw' });
  return tabs;
};

export { tabsOf };
