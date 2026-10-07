/* @layer renderer-app @kind logic */
import type { ProblemField, TemplateProblem } from '../SessionBuilder.type';
import { PLAYER_GRID_CLASS } from '../SessionBuilder.constants';

const quoted = (value: string) => `"${value.replace(/["\\]/g, '\\$&')}"`;

const playerTarget = (slot: number, field: ProblemField, optionLabel?: string): string => {
  const row = `.${PLAYER_GRID_CLASS} [data-row-key="${slot}"]`;
  if (field === 'name' || field === 'game' || field === 'source') return `${row} [data-cell="${field}"]`;
  if (field === 'option' && optionLabel) return `.session-builder__override-rows [role="group"][aria-label=${quoted(optionLabel)}]`;
  return row;
};

const problemTarget = ({ field, slot, optionLabel }: TemplateProblem): string => {
  if (slot !== undefined) return playerTarget(slot, field, optionLabel);
  if (field === 'host') return '[data-section="host"]';
  if (field === 'players') return `.${PLAYER_GRID_CLASS}`;
  return `[data-problem-target="${field}"]`;
};

export { problemTarget };
