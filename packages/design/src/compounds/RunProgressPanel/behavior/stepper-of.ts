/* @layer renderer-app @kind logic */
import type { StepperStep } from '@drizztdourden08/tessera/primitives';
import type { RunProgressStep } from '../RunProgressPanel.type';

const stepperOf = (steps: readonly RunProgressStep[], failed: boolean): { steps: StepperStep[]; currentId: string } => {
  const current = steps.find((step) => step.state === 'current') ?? steps[steps.length - 1];
  return {
    currentId: current?.id ?? '',
    steps: steps.map(({ id, label }) => ({ id, label, error: failed && id === current?.id })),
  };
};

export { stepperOf };
