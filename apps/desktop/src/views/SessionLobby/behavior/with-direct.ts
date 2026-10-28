/* @layer renderer-app @kind logic */
import { isHosted } from '@archipelia/model';
import type { GamePreset, InstalledGame, SessionPlayer } from '@archipelia/model';
import { withGame } from './with-game';

const withDirect = (player: SessionPlayer, on: boolean, installed: InstalledGame[], presets: GamePreset[]): SessionPlayer => {
  if (on) return { ...player, direct: true };
  if (isHosted(player)) return { ...player, direct: false };
  return { ...withGame(player, installed[0]?.game ?? '', presets), direct: false };
};

export { withDirect };
