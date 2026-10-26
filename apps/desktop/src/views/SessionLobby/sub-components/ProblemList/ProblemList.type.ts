/* @layer renderer-app @kind types */
import type { TemplateProblem } from '../../SessionLobby.type';

type ProblemListProps = {
  problems: TemplateProblem[];
  attempted: boolean;
  onShow: (problem: TemplateProblem) => void;
};

export type { ProblemListProps };
