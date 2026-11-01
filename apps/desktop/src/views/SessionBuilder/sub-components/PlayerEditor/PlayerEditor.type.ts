/* @layer renderer-app @kind types */
import type { GamePreset, InstalledGame, SessionPlayer } from '@archipelia/model';
import type { usePlayersEditor } from '../../../SessionLobby/behavior/usePlayersEditor';

type PlayerEditorProps = {
  player: SessionPlayer;
  installed: InstalledGame[];
  presets: GamePreset[];
  busy: boolean;
  overrides: boolean;
  actions: ReturnType<typeof usePlayersEditor>;
  onOverrides: (slot: number) => void;
};

export type { PlayerEditorProps };
