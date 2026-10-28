/* @layer renderer-app @kind logic */
import type { TemplateProblem } from '../SessionLobby.type';
import { SEAT_EDITOR_CLASS } from '../SessionLobby.constants';

const quoted = (value: string) => `"${value.replace(/["\\]/g, '\\$&')}"`;

const problemTarget = ({ field, optionLabel }: TemplateProblem): string => {
  const editor = `.${SEAT_EDITOR_CLASS}`;
  if (field === 'option') return optionLabel ? `.session-lobby__override-rows [role="group"][aria-label=${quoted(optionLabel)}]` : editor;
  return `${editor} [data-cell="${field}"]`;
};

export { problemTarget };
