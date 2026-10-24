/* @layer tooling-scripts @kind logic */
import { requirementName } from './requirement-name.mjs';
import { versionInRange } from './version-in-range.mjs';

const matches = (rule, ap, python) =>
  (rule.ap === undefined || versionInRange(ap, rule.ap)) && (rule.python === undefined || versionInRange(python, rule.python));

const applyRules = (rules, ap, python) => {
  const applied = rules.filter((rule) => matches(rule, ap, python));
  const skip = [...new Set(applied.flatMap((rule) => rule.skip.map(requirementName)))];
  const extra = new Map();
  applied.forEach((rule) => rule.extra.forEach((spec) => extra.set(requirementName(spec), spec)));
  return { skip, extra: [...extra.values()], rules: applied };
};

export { applyRules };
