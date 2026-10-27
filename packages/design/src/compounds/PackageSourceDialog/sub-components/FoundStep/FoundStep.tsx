/* @layer renderer-app @kind component */
import { ErrorCallout } from '../../../ErrorCallout';
import { useStartOnMount } from '../../behavior/useStartOnMount';
import { SOURCE_TEXT } from '../../PackageSourceDialog.constants';
import type { StepBodyProps } from '../../PackageSourceDialog.type';
import { FoundPlan } from '../FoundPlan';
import { SourceBusy } from '../SourceBusy';

const FoundStep = ({ dialog, wizard, view }: StepBodyProps) => {
  const { step, onPlan } = dialog;
  const { candidate, plan } = view;
  const needsPlan = candidate !== undefined && (step.kind === 'idle' || step.candidate.id !== candidate.id);
  useStartOnMount(needsPlan, () => candidate && onPlan(candidate));
  if (!candidate) return null;
  if (step.kind === 'planFailed' && step.candidate.id === candidate.id) return <ErrorCallout message={step.message} onRetry={() => onPlan(candidate)} />;
  if (!plan) return <SourceBusy text={SOURCE_TEXT.checking(candidate.id)} />;
  const { values, update } = wizard;
  return <FoundPlan plan={plan} route={values.route} typed={values.wheelTyped} onRoute={(route) => update({ route })} onTyped={(wheelTyped) => update({ wheelTyped })} />;
};

export { FoundStep };
