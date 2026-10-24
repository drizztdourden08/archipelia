/* @layer core @kind logic */
import { bwrapCommand } from './bwrap-command';
import type { SandboxRunner } from './sandbox.type';

const createBwrapRunner = (bwrap: string): SandboxRunner => ({
  mode: 'bwrap',
  confine: (scope) => (command) => bwrapCommand(bwrap, scope, command),
});

export { createBwrapRunner };
