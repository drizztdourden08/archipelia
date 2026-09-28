/* @layer renderer-app @kind logic */
import type { SessionTemplate } from '@archipelia/model';

const matchesTemplate = (template: SessionTemplate, query: string) => {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  const haystack = [template.name, ...template.players.flatMap((player) => [player.name, player.game])].join(' ').toLowerCase();
  return haystack.includes(needle);
};

export { matchesTemplate };
