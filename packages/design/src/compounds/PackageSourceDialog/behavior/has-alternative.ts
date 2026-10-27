/* @layer renderer-app @kind logic */
import type { SourcePlan } from '@archipelia/model';

const hasAlternative = (plan: SourcePlan | undefined): boolean => Boolean(plan?.wheel) || plan?.pypi?.linked === true;

export { hasAlternative };
