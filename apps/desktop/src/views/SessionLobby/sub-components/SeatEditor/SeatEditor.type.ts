/* @layer renderer-app @kind types */
import type { GamePreset, InstalledGame, SessionPlayer } from '@archipelia/model';
import type { usePlayersEditor } from '../../behavior/usePlayersEditor';

type SeatEditorProps = {
  player: SessionPlayer;
  installed: InstalledGame[];
  presets: GamePreset[];
  busy: boolean;
  overridesOpen: boolean;
  actions: ReturnType<typeof usePlayersEditor>;
  onOverrides: (slot: number) => void;
  onClose: () => void;
};

export type { SeatEditorProps };
