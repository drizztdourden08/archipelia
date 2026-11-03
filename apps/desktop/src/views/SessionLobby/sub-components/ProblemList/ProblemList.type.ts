/* @layer renderer-app @kind types */
import type { TemplateProblem } from '@archipelia/sessions/validation';

type ProblemListProps = {
  problems: readonly TemplateProblem[];
  attempted: boolean;
  onOpenSlot: (slot: number) => void;
};

export type { ProblemListProps };
