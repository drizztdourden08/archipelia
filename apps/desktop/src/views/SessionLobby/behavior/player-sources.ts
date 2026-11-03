/* @layer renderer-app @kind logic */
import type { GamePreset, InstalledGame, SetPlayer } from '@archipelia/model';

const sourcesOf = (player: SetPlayer | undefined, installed: InstalledGame[], presets: GamePreset[]) => {
  const presetId = player?.source.kind === 'preset' ? player.source.presetId : '';
  return {
    game: installed.find((entry) => entry.game === player?.game),
    preset: presets.find((entry) => entry.id === presetId),
  };
};

export { sourcesOf };
