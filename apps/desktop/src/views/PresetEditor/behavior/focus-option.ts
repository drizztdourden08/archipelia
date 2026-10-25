/* @layer renderer-app @kind logic */
import { FOCUSABLE } from './focus-option.constants';

const focusOption = (id: string, root: Document = document): boolean => {
  const control = root.getElementById(id);
  if (!control) return false;
  control.scrollIntoView({ block: 'center' });
  const input = control.matches(FOCUSABLE) ? control : control.closest('.form-row__control')?.querySelector<HTMLElement>(FOCUSABLE);
  input?.focus({ preventScroll: true });
  return true;
};

export { focusOption };
