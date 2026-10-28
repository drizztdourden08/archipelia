/* @layer renderer-app @kind logic */
import { isHosted } from '@archipelia/model';
import type { GamePreset, HostedPlayer, SessionPlayer } from '@archipelia/model';
import { presetsFor } from './presets-for';

const withGame = (player: SessionPlayer, game: string, presets: GamePreset[]): HostedPlayer => {
  if (isHosted(player) && player.source.kind === 'yaml') return { ...player, game };
  const first = presetsFor(presets, game)[0];
  return { ...player, game, source: { kind: 'preset', presetId: first?.id ?? '', overrides: {} } };
};

export { withGame };
