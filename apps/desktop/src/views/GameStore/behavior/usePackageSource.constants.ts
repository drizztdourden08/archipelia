/* @layer renderer-app @kind config */
import type { PackageSourceStep, SourceSearch } from '@archipelia/design';
import type { FinishState } from './usePackageSource.type';

const IDLE: PackageSourceStep = { kind: 'idle' };

const FIRST_SEARCH: SourceSearch = { suggestions: null, looking: false, failed: undefined };

const FINISH = { idle: { kind: 'idle' }, running: { kind: 'running' }, done: { kind: 'done' }, failed: { kind: 'failed' } } as const satisfies Record<string, FinishState>;

const SOURCE_FAILURE = {
  search: 'Could not look for the package on GitHub.',
  plan: 'Could not read that project.',
  pypi: 'Could not install the package from the Python Package Index.',
  wheel: 'Could not get the ready-made build from GitHub.',
  build: 'Could not build the package.',
  tool: 'Could not install the build tool.',
  check: 'Could not install the package.',
  install: 'Could not install the game.',
} as const;

const TOOL_RESULT = {
  restart: 'The computer needs a restart to finish this. Restart it, open Archipelia again and click Check again.',
  dialog: 'The installer window is open. Finish it, then click Check again.',
} as const;

export { FINISH, FIRST_SEARCH, IDLE, SOURCE_FAILURE, TOOL_RESULT };
