/* @layer renderer-app @kind logic */
import { playerFileOf } from '@archipelia/model';
import type { GamePreset, InstalledGame, SetPlayer } from '@archipelia/model';
import { yamlPresetOf } from './yaml-preset-of';

const sourcesOf = (player: SetPlayer | undefined, installed: InstalledGame[], presets: GamePreset[]) => {
  const presetId = player?.source.kind === 'preset' ? player.source.presetId : '';
  const game = installed.find((entry) => entry.game === player?.game);
  const fromFile = player && game && playerFileOf(game) === 'app' ? yamlPresetOf(player, game) : undefined;
  return { game, preset: fromFile ?? presets.find((entry) => entry.id === presetId) };
};

export { sourcesOf };
