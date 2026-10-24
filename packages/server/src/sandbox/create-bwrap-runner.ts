/* @layer core @kind logic */
import { bwrapCommand } from './bwrap-command';
import type { BwrapFeatures, SandboxRunner } from './sandbox.type';

const createBwrapRunner = (bwrap: string, features: BwrapFeatures): SandboxRunner => ({
  mode: 'bwrap',
  confine: (scope) => (command) => bwrapCommand(bwrap, features, scope, command),
});

export { createBwrapRunner };
