/* @layer renderer-app @kind logic */
import type { ServerEntry } from '@archipelia/model';
import type { SecretInputs } from '../ServerManager.type';
import { DRAFT_RULES } from '../ServerManager.constants';

const draftProblems = (entry: ServerEntry, inputs: SecretInputs): string[] =>
  DRAFT_RULES.filter((rule) => rule.broken(entry, inputs)).map((rule) => rule.message);

export { draftProblems };
