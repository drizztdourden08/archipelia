/* @layer renderer-app @kind logic */
import type { SpoilerTrackerControls } from '@archipelia/design';
import { GROUP_OPTIONS, LISTED, VIEW_OPTIONS } from '../SpoilerWidget.constants';
import type { GroupBy, SpoilerState } from '../SpoilerWidget.type';

const controlsOf = ({ tab, by, setBy, view, setView }: SpoilerState): SpoilerTrackerControls | undefined => {
  if (!LISTED.includes(tab)) return undefined;
  return {
    groupBy: tab === 'placements'
      ? { label: 'Group by', value: by, options: GROUP_OPTIONS, onChange: (value) => setBy(value as GroupBy) }
      : undefined,
    view: { label: 'Row detail', value: view, options: VIEW_OPTIONS, onChange: setView },
  };
};

export { controlsOf };
