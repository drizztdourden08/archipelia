/* @layer renderer-app @kind types */
import type { GamePreset, InstalledGame, OptionValue, SessionPlayer } from '@archipelia/model';

type OverridesPanelProps = {
  player: SessionPlayer;
  game?: InstalledGame;
  preset?: GamePreset;
  onValue: (slot: number, key: string, value: OptionValue, presetValue: OptionValue) => void;
  onReset: (slot: number, key: string) => void;
  onResetAll: (slot: number) => void;
  onClose: (slot: number) => void;
};

export type { OverridesPanelProps };
