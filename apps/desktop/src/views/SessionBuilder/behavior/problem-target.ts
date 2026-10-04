/* @layer renderer-app @kind logic */
import type { ProblemField, TemplateProblem } from '../SessionBuilder.type';

const quoted = (value: string) => `"${value.replace(/["\\]/g, '\\$&')}"`;

const playerTarget = (slot: number, field: ProblemField, optionLabel?: string): string => {
  const row = `[role="group"][aria-label="Player ${slot}"]`;
  if (field === 'name') return `${row} input[aria-label="Name of player ${slot}"]`;
  if (field === 'game') return `${row} [aria-label^="Game of player ${slot}:"]`;
  if (field === 'source') return `${row} [aria-label^="Preset of player ${slot}:"]`;
  if (field === 'option' && optionLabel) return `.session-builder__override-rows [role="group"][aria-label=${quoted(optionLabel)}]`;
  return row;
};

const problemTarget = ({ field, slot, optionLabel }: TemplateProblem): string => {
  if (slot !== undefined) return playerTarget(slot, field, optionLabel);
  if (field === 'host') return '[data-section="host"]';
  return `[data-problem-target="${field}"]`;
};

export { problemTarget };
