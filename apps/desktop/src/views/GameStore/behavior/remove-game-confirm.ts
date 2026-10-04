/* @layer renderer-app @kind logic */
import type { ConfirmDeleteOptions } from '@drizztdourden08/brock-react';
import type { GamePreset, SessionTemplate } from '@archipelia/model';

const counted = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`;

const usersOf = (game: string, presets: readonly GamePreset[], templates: readonly SessionTemplate[]) => {
  const presetCount = presets.filter((preset) => preset.game === game).length;
  const templateCount = templates.filter((template) => template.players.some((player) => player.game === game)).length;
  if (presetCount + templateCount === 0) return 'No preset or session uses it.';
  return `${counted(presetCount, 'preset')} and ${counted(templateCount, 'session')} use it.`;
};

const removeGameConfirm = (
  title: string, game: string, presets: readonly GamePreset[], templates: readonly SessionTemplate[],
): ConfirmDeleteOptions => ({
  what: title,
  consequence: `Its world leaves the engine. ${usersOf(game, presets, templates)}`,
});

export { removeGameConfirm };
