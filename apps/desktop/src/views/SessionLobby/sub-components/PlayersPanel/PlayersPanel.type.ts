/* @layer renderer-app @kind types */
import type { GamePreset, InstalledGame, SessionPlayer } from '@archipelia/model';
import type { usePlayersEditor } from '../../behavior/usePlayersEditor';

type PlayersPanelProps = {
  players: SessionPlayer[];
  installed: InstalledGame[];
  presets: GamePreset[];
  selected?: SessionPlayer;
  busy: boolean;
  direct: boolean;
  actions: ReturnType<typeof usePlayersEditor>;
  onEdit: (slot: number) => void;
};

export type { PlayersPanelProps };
