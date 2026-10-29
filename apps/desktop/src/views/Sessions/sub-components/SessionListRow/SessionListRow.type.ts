/* @layer renderer-app @kind types */
import type { IconName } from '@drizztdourden08/tessera/primitives';

type SessionListRowProps = {
  id: string;
  name: string;
  summary: string;
  place: IconName;
  selected: boolean;
  tabOpen: boolean;
  unsaved: boolean;
  busy: boolean;
  onSelect: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
};

export type { SessionListRowProps };
