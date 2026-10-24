/* @layer renderer-app @kind logic */
import type { RequirementRule } from '@archipelia/model';

const scopeOf = ({ ap, python }: RequirementRule) => {
  const parts = [ap && `Archipelago ${ap}`, python && `Python ${python}`].filter(Boolean);
  return parts.length > 0 ? ` for ${parts.join(' and ')}` : '';
};

const ruleText = (rule: RequirementRule): string => {
  const parts = [rule.skip.length > 0 && `skips ${rule.skip.join(', ')}`, rule.extra.length > 0 && `adds ${rule.extra.join(', ')}`].filter(Boolean);
  return `${parts.join(' and ') || 'changes nothing'}${scopeOf(rule)}`;
};

export { ruleText };
