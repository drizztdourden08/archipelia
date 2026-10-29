/* @layer renderer-app @kind types */
import type { TemplateProblem } from '@archipelia/sessions/validation';

type ProblemListProps = {
  problems: TemplateProblem[];
  attempted: boolean;
  onShow: (problem: TemplateProblem) => void;
};

export type { ProblemListProps };
