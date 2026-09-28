/* @layer renderer-app @kind types */
import type { GamePreset, InstalledGame, SessionPlayer } from '@archipelia/model';

type PlayerActions = {
  add: () => void;
  duplicate: (slot: number) => void;
  importYaml: (slot: number) => void;
  remove: (slot: number) => void;
  rename: (slot: number, name: string) => void;
  setGame: (slot: number, game: string) => void;
  setSource: (slot: number, value: string, game: string) => void;
};

type PlayersCardProps = {
  players: SessionPlayer[];
  installed: InstalledGame[];
  presets: GamePreset[];
  selectedSlot?: number;
  busy: boolean;
  actions: PlayerActions;
  onEdit: (slot: number) => void;
};

export type { PlayersCardProps };
