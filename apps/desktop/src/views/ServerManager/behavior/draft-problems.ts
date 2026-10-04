/* @layer renderer-app @kind logic */
import type { ServerEntry } from '@archipelia/model';
import type { DraftProblem, SecretInputs } from '../ServerManager.type';
import { DRAFT_RULES } from '../ServerManager.constants';

const draftProblems = (entry: ServerEntry, inputs: SecretInputs): DraftProblem[] =>
  DRAFT_RULES.filter((rule) => rule.broken(entry, inputs)).map(({ field, message }) => ({ field, message }));

export { draftProblems };
