/* @layer renderer-app @kind logic */
import type { SpoilerTrackerControls } from '@archipelia/design';
import { GROUP_OPTIONS, VIEW_OPTIONS } from '../SpoilerWidget.constants';
import type { GroupBy, SpoilerTab } from '../SpoilerWidget.type';
import type { useSpoilerState } from './useSpoilerState';

type State = ReturnType<typeof useSpoilerState>;

const LISTED: readonly SpoilerTab[] = ['placements', 'playthrough', 'entrances', 'paths'];

const controlsOf = ({ tab, by, setBy, view, setView }: State): SpoilerTrackerControls | undefined => {
  if (!LISTED.includes(tab)) return undefined;
  return {
    groupBy: tab === 'placements'
      ? { label: 'Group by', value: by, options: GROUP_OPTIONS, onChange: (value) => setBy(value as GroupBy) }
      : undefined,
    view: { label: 'Row detail', value: view, options: VIEW_OPTIONS, onChange: setView },
  };
};

export { controlsOf };
