/* @layer renderer-app @kind logic */
import type { WizardProblem } from '@drizztdourden08/tessera/composites';
import type { SourceValues } from '../PackageSourceDialog.type';
import { STEP_TEXT } from './step-text.constants';
import type { Run } from './step-problems.type';

const sourceProblem = ({ view }: Run, values: SourceValues): WizardProblem | null => {
  const { candidate } = view;
  if (!candidate) return STEP_TEXT.sourceNone;
  const ready = candidate.warnings.length > 0 ? values.typed.trim().toLowerCase() === candidate.id.toLowerCase() : values.trusted;
  return ready ? null : STEP_TEXT.sourceTrust;
};

export { sourceProblem };
