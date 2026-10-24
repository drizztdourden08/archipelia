/* @layer core @kind types */
import type { PythonBuild, RequirementRule } from '@archipelia/model';

type SpecParams = { ap: { version: string; commit: string }; python: PythonBuild; rules?: RequirementRule[] };

export type { SpecParams };
