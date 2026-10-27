/* @layer renderer-app @kind logic */
import type { WizardProblem } from '@drizztdourden08/tessera/composites';
import { PLAN_TEXT } from '../PackageSourceDialog.constants';
import type { SourceValues } from '../PackageSourceDialog.type';
import { hasAlternative } from './has-alternative';
import { STEP_TEXT } from './step-text.constants';
import type { Run } from './step-problems.type';

const wheelProblem = ({ view }: Run, values: SourceValues): WizardProblem | null => {
  const { plan } = view;
  if (values.route !== 'wheel' || !plan?.wheel || plan.wheel.digest !== undefined) return null;
  const name = `${plan.owner}/${plan.repo}`;
  return values.wheelTyped.trim().toLowerCase() === name.toLowerCase() ? null : { message: PLAN_TEXT.wheelType(name), inField: true };
};

const foundProblem = (run: Run, values: SourceValues): WizardProblem | null => {
  const { props, view } = run;
  if (!view.candidate) return STEP_TEXT.sourceNone;
  if (props.step.kind === 'planFailed') return props.step.message;
  if (!view.plan) return STEP_TEXT.checking(view.candidate.id);
  if (hasAlternative(view.plan) && !values.route) return STEP_TEXT.routePick;
  return wheelProblem(run, values);
};

export { foundProblem };
