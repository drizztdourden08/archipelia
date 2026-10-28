/* @layer renderer-app @kind logic */
import type { ButtonVariant } from '@drizztdourden08/tessera/primitives';
import type { BuilderButton } from '../SessionBuilder.type';

const buttonVariant = (id: BuilderButton, index: number): ButtonVariant => {
  if (index === 0) return 'primary';
  return id === 'discard' ? 'ghost' : 'secondary';
};

export { buttonVariant };
