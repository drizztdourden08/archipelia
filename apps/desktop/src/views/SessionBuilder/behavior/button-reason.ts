/* @layer renderer-app @kind logic */
import type { BuilderButton, ButtonReasons } from '../SessionBuilder.type';

const buttonReason = (id: BuilderButton, { setup, once }: ButtonReasons): string | undefined => {
  if (id === 'once') return setup ?? once;
  return id === 'run' || id === 'save-run' ? setup : undefined;
};

export { buttonReason };
