/* @layer core @kind types */
import type { RequirementRule, SmokeResult } from '@archipelia/model';

type EngineMeta = {
  pythonRelease: string;
  target: string;
  builtAt: number;
  rules: RequirementRule[];
  packages: string[];
  smoke?: SmokeResult;
};

export type { EngineMeta };
