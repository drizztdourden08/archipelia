/* @layer renderer-app @kind config */
import type { PackageSourceStep } from '@archipelia/design';

const SEARCHING: PackageSourceStep = { kind: 'searching' };

const SOURCE_FAILURE = {
  search: 'Could not look for the package on GitHub.',
  plan: 'Could not read that project.',
  pypi: 'Could not install the package from the Python Package Index.',
  wheel: 'Could not get the ready-made build from GitHub.',
  build: 'Could not build the package.',
  tool: 'Could not install the build tool.',
} as const;

const TOOL_RESULT = {
  restart: 'The computer needs a restart to finish this. Restart it, open Archipelia again and click Check again.',
  dialog: 'The installer window is open. Finish it, then click Check again.',
} as const;

export { SEARCHING, SOURCE_FAILURE, TOOL_RESULT };
