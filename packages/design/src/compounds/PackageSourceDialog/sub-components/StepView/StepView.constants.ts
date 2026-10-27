/* @layer renderer-app @kind config */
import type { ComponentType } from 'react';
import type { StepBodyProps } from '../../PackageSourceDialog.type';
import { BuildStep } from '../BuildStep';
import { CheckStep } from '../CheckStep';
import { CompilerStep } from '../CompilerStep';
import { ConfirmStep } from '../ConfirmStep';
import { ConsentStep } from '../ConsentStep';
import { DoneStep } from '../DoneStep';
import { FetchStep } from '../FetchStep';
import { FoundStep } from '../FoundStep';
import { GitStep } from '../GitStep';
import { HowStep } from '../HowStep';
import { InstallStep } from '../InstallStep';
import { PipStep } from '../PipStep';
import { PrepareStep } from '../PrepareStep';
import { SourceStep } from '../SourceStep';
import { ToolStep } from '../ToolStep';
import { ToolsStep } from '../ToolsStep';
import { WhyStep } from '../WhyStep';

const STEP_BODY: Record<string, ComponentType<StepBodyProps>> = {
  why: WhyStep,
  source: SourceStep,
  found: FoundStep,
  how: HowStep,
  'fetch-wheel': FetchStep,
  'fetch-pypi': FetchStep,
  confirm: ConfirmStep,
  prepare: PrepareStep,
  tools: ToolsStep,
  build: BuildStep,
  tool: ToolStep,
  compiler: CompilerStep,
  git: GitStep,
  pip: PipStep,
  check: CheckStep,
  consent: ConsentStep,
  install: InstallStep,
  done: DoneStep,
};

export { STEP_BODY };
