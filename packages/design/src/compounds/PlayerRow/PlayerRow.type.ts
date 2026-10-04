/* @layer renderer-app @kind types */
import type { SelectOption } from '@drizztdourden08/tessera/primitives';

type PlayerRowProps = {
  slot: number;
  name: string;
  game: string;
  source: string;
  gameOptions: SelectOption[];
  sourceOptions: SelectOption[];
  overrides: string;
  changed: boolean;
  fileName?: string;
  selected: boolean;
  canEdit: boolean;
  busy?: boolean;
  onName: (slot: number, name: string) => void;
  onGame: (slot: number, game: string) => void;
  onSource: (slot: number, value: string) => void;
  onImport: (slot: number) => void;
  onEdit: (slot: number) => void;
  onDuplicate: (slot: number) => void;
  onRemove: (slot: number) => void;
};

export type { PlayerRowProps };
