/* @layer renderer-app @kind logic */
import { FOCUSABLE } from '../GameOptionsPanel.constants';
import { optionDomId } from './option-dom-id';

const focusOption = (key: string, root: Document = document): boolean => {
  const cell = root.getElementById(optionDomId(key));
  if (!cell) return false;
  cell.scrollIntoView({ block: 'center' });
  cell.querySelector<HTMLElement>(FOCUSABLE)?.focus({ preventScroll: true });
  return true;
};

export { focusOption };
