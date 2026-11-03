/* @layer renderer-app @kind types */
import type { SetPlayer } from '@archipelia/model';

type PlayerOverridesCellProps = {
  player: SetPlayer;
  selected: boolean;
  appGame: boolean;
  onEdit: (slot: number) => void;
};

export type { PlayerOverridesCellProps };
