/* @layer renderer-app @kind types */
import type { TemplateProblem } from '../../SessionBuilder.type';

type ProblemListProps = {
  problems: TemplateProblem[];
  attempted: boolean;
  onShow: (problem: TemplateProblem) => void;
};

export type { ProblemListProps };
