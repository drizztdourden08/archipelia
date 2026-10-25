/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useState } from 'react';
import type { JumpParams } from './useJumpToOption.type';
import { focusOption } from './focus-option';
import { jumpFilter } from './jump-filter';
import { optionDomId } from './option-dom-id';

const useJumpToOption = ({ schema, filter, visible, setTab, setQuery, setShowAdvanced }: JumpParams) => {
  const [target, setTarget] = useState<string | null>(null);

  const jump = useCallback((key: string) => {
    const def = schema.options.find((option) => option.key === key);
    if (!def) return;
    const next = jumpFilter(def, filter);
    setTab(next.tab);
    setQuery(next.query);
    setShowAdvanced(next.showAdvanced);
    setTarget(key);
  }, [schema, filter, setTab, setQuery, setShowAdvanced]);

  useEffect(() => {
    if (target === null || !visible.some((def) => def.key === target)) return;
    focusOption(optionDomId(target));
    setTarget(null);
  }, [target, visible]);

  return jump;
};

export { useJumpToOption };
