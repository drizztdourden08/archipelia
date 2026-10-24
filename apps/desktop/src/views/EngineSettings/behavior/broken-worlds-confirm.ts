/* @layer renderer-app @kind logic */
import type { ConfirmActionOptions } from '@drizztdourden08/brock-react';

const brokenWorldsConfirm = (ap: string, worlds: readonly string[]): ConfirmActionOptions => ({
  title: 'Switch anyway?',
  message: `${worlds.length} installed ${worlds.length === 1 ? 'world does' : 'worlds do'} not load on ${ap}: ${worlds.join(', ')}.`,
  confirmLabel: 'Switch anyway',
  variant: 'danger',
});

export { brokenWorldsConfirm };
