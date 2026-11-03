/* @layer renderer-app @kind logic */
import type { GamePreset, SessionPlayer, SetPlayer } from '@archipelia/model';
import { newSet } from './new-set';
import { presetsFor } from './presets-for';

const withGame = (player: SessionPlayer, game: string, presets: GamePreset[], name: string): SetPlayer => {
  if (player.kind === 'set' && player.source.kind === 'yaml') return { ...player, game };
  const presetId = presetsFor(presets, game)[0]?.id ?? '';
  return newSet(player.slot, player.kind === 'set' ? player.name : name, game, presetId);
};

export { withGame };
