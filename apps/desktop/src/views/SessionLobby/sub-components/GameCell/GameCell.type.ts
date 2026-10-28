/* @layer renderer-app @kind types */
import type { InstalledGame, SessionPlayer } from '@archipelia/model';

type GameCellProps = { player: SessionPlayer; installed: InstalledGame[]; onGame: (slot: number, game: string) => void };

export type { GameCellProps };
