/* @layer renderer-app @kind logic */
import type { TemplateProblem } from '@archipelia/sessions/validation';
import { FIELD_CONTROLS } from './focus-problem.constants';
import { problemTarget } from './problem-target';

const controlOf = (target: HTMLElement): HTMLElement | null =>
  (target.matches(FIELD_CONTROLS) ? target : target.querySelector<HTMLElement>(FIELD_CONTROLS));

const focusProblem = (root: HTMLElement | null, problem: TemplateProblem): boolean => {
  const target = root?.querySelector<HTMLElement>(problemTarget(problem));
  if (!target) return false;
  target.scrollIntoView({ block: 'center' });
  const control = controlOf(target);
  control?.focus({ preventScroll: true });
  return control !== null;
};

export { focusProblem };
