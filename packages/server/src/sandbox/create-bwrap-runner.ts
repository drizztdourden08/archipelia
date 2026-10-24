/* @layer core @kind logic */
import { bwrapCommand } from './bwrap-command';
import type { BwrapFeatures, SandboxRunner } from './sandbox.type';
import { taskCount } from './task-count';

const createBwrapRunner = (bwrap: string, features: BwrapFeatures, tasks: () => number | undefined = taskCount): SandboxRunner => ({
  mode: 'bwrap',
  confine: (scope) => (command) => bwrapCommand({ bwrap, features, tasks: tasks() }, scope, command),
});

export { createBwrapRunner };
