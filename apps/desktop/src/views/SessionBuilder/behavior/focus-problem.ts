/* @layer renderer-app @kind logic */
import type { TemplateProblem } from '../SessionBuilder.type';
import { FIELD_CONTROLS, OPTION_CONTROLS } from './focus-problem.constants';
import { problemTarget } from './problem-target';

const controlOf = (target: HTMLElement, field: TemplateProblem['field']): HTMLElement | null => {
  if (target.matches(FIELD_CONTROLS)) return target;
  return target.querySelector<HTMLElement>(field === 'option' ? OPTION_CONTROLS : FIELD_CONTROLS);
};

const focusProblem = (root: HTMLElement | null, problem: TemplateProblem): boolean => {
  const target = root?.querySelector<HTMLElement>(problemTarget(problem));
  if (!target) return false;
  target.scrollIntoView({ block: 'center' });
  const control = controlOf(target, problem.field);
  control?.focus({ preventScroll: true });
  return control !== null;
};

export { focusProblem };
