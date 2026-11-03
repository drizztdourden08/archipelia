/* @layer renderer-app @kind logic */
import type { TemplateProblem } from '@archipelia/sessions/validation';
import { SEAT_EDITOR_CLASS } from '../SessionLobby.constants';

const problemTarget = ({ field }: TemplateProblem): string => {
  const editor = `.${SEAT_EDITOR_CLASS}`;
  if (field === 'option') return editor;
  return `${editor} [data-cell="${field}"]`;
};

export { problemTarget };
