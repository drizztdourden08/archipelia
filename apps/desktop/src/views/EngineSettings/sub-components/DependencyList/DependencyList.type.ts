/* @layer renderer-app @kind types */
import type { RequirementRule } from '@archipelia/model';

type DependencyListProps = { packages: readonly string[]; rules: readonly RequirementRule[] };

export type { DependencyListProps };
