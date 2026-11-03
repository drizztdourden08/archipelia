/* @layer renderer-app @kind types */
import type { SetPlayer } from '@archipelia/model';

type PlayerOverridesCellProps = {
  player: SetPlayer;
  selected: boolean;
  onEdit: (slot: number) => void;
};

export type { PlayerOverridesCellProps };
