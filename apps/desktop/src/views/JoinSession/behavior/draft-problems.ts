/* @layer renderer-app @kind logic */
import { DISPLAY_LIMIT, NAME_LIMIT, PROBLEM, YAML_VALUE } from '../JoinSession.constants';
import type { PlayerDraft } from '../JoinSession.type';

const within = (text: string, limit: number) => text.trim().length >= 1 && text.trim().length <= limit;

const draftProblems = (draft: PlayerDraft) => ({
  game: draft.game === '' ? PROBLEM.game : null,
  file: draft.source === YAML_VALUE && !draft.file ? PROBLEM.file : null,
  slotName: within(draft.slotName, NAME_LIMIT) ? null : PROBLEM.name,
  displayName: within(draft.displayName, DISPLAY_LIMIT) ? null : PROBLEM.displayName,
});

export { draftProblems };
