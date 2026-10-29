/* @layer renderer-app @kind logic */
import type { GamePreset, SessionPlayer } from '@archipelia/model';
import { PLAYER_TEXT } from '../SessionBuilder.constants';

const sourceText = ({ source }: SessionPlayer, presets: readonly GamePreset[]): string | null => {
  if (!source) return null;
  if (source.kind === 'yaml') return source.fileName ? `${PLAYER_TEXT.yaml} ${source.fileName}` : PLAYER_TEXT.yaml;
  const preset = presets.find((entry) => entry.id === source.presetId);
  return preset ? `${PLAYER_TEXT.preset} ${preset.name}` : PLAYER_TEXT.noPreset;
};

const playerSummary = (player: SessionPlayer, presets: readonly GamePreset[]): string => {
  if (!player.game) return player.direct ? PLAYER_TEXT.ownGame : PLAYER_TEXT.noGame;
  const text = [player.game, sourceText(player, presets)].filter(Boolean).join(', ');
  return player.direct ? `${text} (${PLAYER_TEXT.fallback})` : text;
};

export { playerSummary };
