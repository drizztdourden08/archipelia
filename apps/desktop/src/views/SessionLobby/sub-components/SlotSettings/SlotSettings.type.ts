/* @layer renderer-app @kind types */
import type { GamePreset, InstalledGame, SetPlayer } from '@archipelia/model';
import type { PlayersEditor } from '../../SessionLobby.type';

type SlotSettingsProps = { player: SetPlayer; installed: InstalledGame[]; presets: GamePreset[]; actions: PlayersEditor };

export type { SlotSettingsProps };
