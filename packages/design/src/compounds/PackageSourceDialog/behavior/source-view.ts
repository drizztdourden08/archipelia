/* @layer renderer-app @kind logic */
import type { SourceCandidate, SourcePlan } from '@archipelia/model';
import { hasAlternative } from './has-alternative';
import type { BuildStage, PackageSourceDialogProps, SourceRoute, SourceValues, SourceView } from '../PackageSourceDialog.type';

const candidateOf = ({ search, step }: PackageSourceDialogProps, values: SourceValues): SourceCandidate | undefined =>
  search.suggestions?.candidates.find((entry) => entry.id === values.pick) ?? (step.kind !== 'idle' && step.candidate.id === values.pick ? step.candidate : undefined);

const planOf = ({ step }: PackageSourceDialogProps, candidate: SourceCandidate | undefined): SourcePlan | undefined =>
  (step.kind === 'plan' || step.kind === 'build') && step.candidate.id === candidate?.id ? step.plan : undefined;

const stageOf = ({ step }: PackageSourceDialogProps, candidate: SourceCandidate | undefined): BuildStage | undefined =>
  step.kind === 'build' && step.candidate.id === candidate?.id ? step.stage : undefined;

const routeOf = (values: SourceValues, plan: SourcePlan | undefined): SourceRoute | '' =>
  values.route || (plan && !hasAlternative(plan) ? 'source' : '');

const stageRuns = (stage: BuildStage | undefined, finish: PackageSourceDialogProps['finish']): boolean =>
  stage?.kind === 'preparing' || stage?.kind === 'installing' || (stage?.kind === 'building' && finish.kind === 'idle');

const sourceView = (props: PackageSourceDialogProps, values: SourceValues): SourceView => {
  const candidate = candidateOf(props, values);
  const plan = planOf(props, candidate);
  const stage = stageOf(props, candidate);
  const asking = props.consent !== null;
  const running = stageRuns(stage, props.finish) || (props.finish.kind === 'running' && !asking);
  return { candidate, plan, stage, route: routeOf(values, plan), asking, running };
};

export { sourceView };
