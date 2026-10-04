/* @layer renderer-app @kind logic */
import type { DraftField, DraftProblem, FieldErrors } from '../ServerManager.type';

const shownErrors = (problems: readonly DraftProblem[], touched: ReadonlySet<DraftField>, attempted: boolean): FieldErrors =>
  Object.fromEntries(problems.filter(({ field }) => attempted || touched.has(field)).map(({ field, message }) => [field, message]));

export { shownErrors };
