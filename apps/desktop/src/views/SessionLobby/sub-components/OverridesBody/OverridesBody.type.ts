/* @layer renderer-app @kind types */
import type { GamePreset, InstalledGame, OptionValue } from '@archipelia/model';
import type { OverrideRow } from '../../SessionLobby.type';

type OverridesBodyProps = {
  game?: InstalledGame;
  preset?: GamePreset;
  readOnly: boolean;
  rows: readonly OverrideRow[];
  onValue: (key: string, value: OptionValue, presetValue: OptionValue) => void;
  onReset: (key: string) => void;
};

export type { OverridesBodyProps };
