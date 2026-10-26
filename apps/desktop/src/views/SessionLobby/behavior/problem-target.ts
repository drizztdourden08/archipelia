/* @layer renderer-app @kind logic */
import type { TemplateProblem } from '../SessionLobby.type';
import { PLAYER_GRID_CLASS } from '../SessionLobby.constants';

const quoted = (value: string) => `"${value.replace(/["\\]/g, '\\$&')}"`;

const problemTarget = ({ field, slot, optionLabel }: TemplateProblem): string => {
  const row = `.${PLAYER_GRID_CLASS} [data-row-key="${slot}"]`;
  if (field === 'option') return optionLabel ? `.session-lobby__override-rows [role="group"][aria-label=${quoted(optionLabel)}]` : row;
  return `${row} [data-cell="${field}"]`;
};

export { problemTarget };
