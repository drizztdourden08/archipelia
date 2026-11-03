/* @layer renderer-app @kind logic */
import type { GamePreset, SessionPlayer, SetPlayer } from '@archipelia/model';
import { PLAYER_TEXT } from '../SessionBuilder.constants';

const sourceText = ({ source }: SetPlayer, presets: readonly GamePreset[]): string => {
  if (source.kind === 'yaml') return source.fileName ? `${PLAYER_TEXT.yaml} ${source.fileName}` : PLAYER_TEXT.yaml;
  const preset = presets.find((entry) => entry.id === source.presetId);
  return preset ? `${PLAYER_TEXT.preset} ${preset.name}` : PLAYER_TEXT.noPreset;
};

const playerSummary = (player: SessionPlayer, presets: readonly GamePreset[]): string => {
  if (player.kind === 'direct') return PLAYER_TEXT.ownGame;
  if (!player.game) return PLAYER_TEXT.noGame;
  return [player.game, sourceText(player, presets)].join(', ');
};

export { playerSummary };
