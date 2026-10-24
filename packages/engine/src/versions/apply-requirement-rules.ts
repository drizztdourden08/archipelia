/* @layer core @kind logic */
import type { RequirementRule } from '@archipelia/model';
import type { AppliedRequirements } from './apply-requirement-rules.type';
import { requirementName } from './requirement-name';
import { versionInRange } from './version-in-range';

const matches = (rule: RequirementRule, ap: string, python: string): boolean =>
  (rule.ap === undefined || versionInRange(ap, rule.ap)) && (rule.python === undefined || versionInRange(python, rule.python));

const applyRequirementRules = (rules: RequirementRule[], ap: string, python: string): AppliedRequirements => {
  const applied = rules.filter((rule) => matches(rule, ap, python));
  const skip = [...new Set(applied.flatMap((rule) => rule.skip.map(requirementName)))];
  const extra = new Map<string, string>();
  applied.forEach((rule) => rule.extra.forEach((spec) => extra.set(requirementName(spec), spec)));
  return { skip, extra: [...extra.values()], rules: applied };
};

export { applyRequirementRules };
