/* @layer core @kind types */
import type { RequirementRule } from '@archipelia/model';

type AppliedRequirements = { skip: string[]; extra: string[]; rules: RequirementRule[] };

export type { AppliedRequirements };
