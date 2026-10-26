/* @layer renderer-app @kind types */
import type { SessionPlayer } from '@archipelia/model';

type PlayerOverridesCellProps = {
  player: SessionPlayer;
  selected: boolean;
  onEdit: (slot: number) => void;
};

export type { PlayerOverridesCellProps };
