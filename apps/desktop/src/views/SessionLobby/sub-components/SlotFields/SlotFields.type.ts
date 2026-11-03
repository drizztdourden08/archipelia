/* @layer renderer-app @kind types */
import type { GamePreset, InstalledGame, SetPlayer } from '@archipelia/model';
import type { PlayersEditor } from '../../SessionLobby.type';

type SlotFieldsProps = {
  player: SetPlayer;
  installed: InstalledGame[];
  presets: GamePreset[];
  allowed: readonly string[];
  appGame: boolean;
  busy: boolean;
  actions: PlayersEditor;
};

export type { SlotFieldsProps };
