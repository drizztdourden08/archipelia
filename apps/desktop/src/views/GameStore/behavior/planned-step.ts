/* @layer renderer-app @kind logic */
import type { PackageSourceStep } from '@archipelia/design';
import type { BuildState } from './usePackageSource.type';

const plannedStep = ({ candidate, plan }: Pick<BuildState, 'candidate' | 'plan'>): PackageSourceStep =>
  ({ kind: 'plan', candidate, plan, checking: false, stillMissing: false, installing: false });

export { plannedStep };
