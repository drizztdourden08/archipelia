/* @layer renderer-app @kind logic */
import type { WizardStepDef } from '@drizztdourden08/tessera/composites';
import type { SourceBuildTool } from '@archipelia/model';
import { TOOL_NAME } from '../PackageSourceDialog.constants';
import type { BuildStage, PackageSourceDialogProps, SourceValues } from '../PackageSourceDialog.type';
import { buildProblem } from './build-problem';
import { TOOL_STAGES } from './build-steps.constants';
import { prepareProblem } from './prepare-problem';
import { runOf } from './run-of';
import { toolProblem } from './tool-problem';
import { STEP_DESCRIPTION, STEP_LABEL, STEP_TEXT } from './step-text.constants';

const onBuildPath = (props: PackageSourceDialogProps, values: SourceValues): boolean =>
  runOf(props, values).view.route === 'source' && values.how === 'build';

const showsTool = (props: PackageSourceDialogProps, values: SourceValues): boolean =>
  onBuildPath(props, values) && (values.tooled || TOOL_STAGES.has(runOf(props, values).view.stage?.kind ?? ''));

const toolOf = (stage: BuildStage | undefined): SourceBuildTool | undefined => {
  if (stage?.kind === 'missing') return stage.missing.tool;
  return stage?.kind === 'installing' ? stage.tool.tool : undefined;
};

const toolLabel = ({ step }: PackageSourceDialogProps): string => {
  const tool = toolOf(step.kind === 'build' ? step.stage : undefined);
  return tool ? STEP_TEXT.toolTitle(TOOL_NAME[tool]) : STEP_LABEL.tool;
};

const buildSteps = (props: PackageSourceDialogProps): readonly WizardStepDef<SourceValues>[] => [
  {
    id: 'confirm',
    label: STEP_LABEL.confirm,
    description: STEP_DESCRIPTION.confirm,
    when: (values) => onBuildPath(props, values),
    buttons: { next: { label: STEP_LABEL.confirm, icon: 'download' } },
  },
  {
    id: 'prepare',
    label: STEP_LABEL.prepare,
    description: STEP_DESCRIPTION.prepare,
    when: (values) => onBuildPath(props, values),
    validate: (values) => prepareProblem(runOf(props, values)),
    busyHint: STEP_TEXT.prepareBusy,
  },
  {
    id: 'tools',
    label: STEP_LABEL.tools,
    description: STEP_DESCRIPTION.tools,
    when: (values) => onBuildPath(props, values),
    buttons: { next: { label: STEP_TEXT.checkAndBuild, icon: 'wrench' } },
  },
  {
    id: 'build',
    label: STEP_LABEL.build,
    description: STEP_DESCRIPTION.build,
    when: (values) => onBuildPath(props, values),
    validate: (values) => buildProblem(runOf(props, values)),
    busyHint: STEP_TEXT.buildBusy(props.module),
  },
  {
    id: 'tool',
    label: toolLabel(props),
    description: STEP_DESCRIPTION.tool,
    when: (values) => showsTool(props, values),
    validate: (values) => toolProblem(runOf(props, values)),
    busyHint: STEP_TEXT.toolBusy,
  },
];

export { buildSteps };
