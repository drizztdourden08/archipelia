/* @layer renderer-app @kind config */
import type { PackageSourceStep } from '@archipelia/design';

const SEARCHING: PackageSourceStep = { kind: 'searching' };

const SOURCE_FAILURE = {
  search: 'Could not look for the package on GitHub.',
  plan: 'Could not read that project.',
  pypi: 'Could not install the package from the Python Package Index.',
} as const;

export { SEARCHING, SOURCE_FAILURE };
