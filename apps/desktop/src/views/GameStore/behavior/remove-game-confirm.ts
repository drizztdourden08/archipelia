/* @layer renderer-app @kind logic */
import type { ConfirmActionOptions } from '@drizztdourden08/brock-react';
import type { GamePreset, SessionTemplate } from '@archipelia/model';

const counted = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`;

const usersOf = (game: string, presets: readonly GamePreset[], templates: readonly SessionTemplate[]) => {
  const presetCount = presets.filter((preset) => preset.game === game).length;
  const templateCount = templates.filter((template) => template.players.some((player) => player.game === game)).length;
  if (presetCount + templateCount === 0) return 'No preset or template uses it.';
  return `${counted(presetCount, 'preset')} and ${counted(templateCount, 'template')} use it.`;
};

const removeGameConfirm = (
  title: string, game: string, presets: readonly GamePreset[], templates: readonly SessionTemplate[],
): ConfirmActionOptions => ({
  title: 'Remove game',
  message: `Remove ${title}? ${usersOf(game, presets, templates)}`,
  confirmLabel: 'Remove',
  variant: 'danger',
});

export { removeGameConfirm };
