/* @layer renderer-app @kind types */
import type { GamePreset, InstalledGame, SetPlayer } from '@archipelia/model';
import type { PlayersEditor } from '../../SessionLobby.type';

type SlotDialogProps = {
  player: SetPlayer;
  installed: InstalledGame[];
  presets: GamePreset[];
  allowed: readonly string[];
  busy: boolean;
  actions: PlayersEditor;
  focusKey?: string | null;
  onFocused?: () => void;
  onClose: () => void;
};

export type { SlotDialogProps };
