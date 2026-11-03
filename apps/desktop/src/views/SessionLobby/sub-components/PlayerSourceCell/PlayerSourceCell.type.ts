/* @layer renderer-app @kind types */
import type { GamePreset, SetPlayer } from '@archipelia/model';

type PlayerSourceCellProps = {
  player: SetPlayer;
  presets: GamePreset[];
  appGame: boolean;
  noted?: boolean;
  busy: boolean;
  onSource: (slot: number, value: string, game: string) => void;
  onImport: (slot: number) => void;
};

export type { PlayerSourceCellProps };
