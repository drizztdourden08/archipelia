/* @layer renderer-app @kind hook */
import { useEffect, useState } from 'react';
import type { FocusParams } from './useFocusOption.type';
import { focusOption } from './focus-option';
import { matchesQuery } from './matches-query';
import { tabIdOf } from './tab-id-of';

const useFocusOption = ({ focusKey, schema, query, tab, setTab, setQuery, onFocused }: FocusParams) => {
  const [pending, setPending] = useState<string | null>(null);

  useEffect(() => {
    const def = focusKey ? schema.options.find((option) => option.key === focusKey) : undefined;
    if (!def) return;
    setTab(tabIdOf(schema, def));
    if (!matchesQuery(def, query)) setQuery('');
    setPending(def.key);
  }, [focusKey]);

  useEffect(() => {
    if (pending === null || !focusOption(pending)) return;
    setPending(null);
    onFocused?.();
  }, [pending, tab, query]);
};

export { useFocusOption };
