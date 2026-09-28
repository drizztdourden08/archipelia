/* @layer renderer-app @kind hook */
import { useMemo, useState } from 'react';
import type { GameSchema } from '@archipelia/model';
import { advancedCount } from './advanced-count';
import { firstTab } from './first-tab';
import { optionTabs } from './option-tabs';
import { visibleOptions } from './visible-options';

const useOptionFilter = (schema: GameSchema) => {
  const [tab, setTab] = useState(() => firstTab(schema));
  const [query, setQuery] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const tabs = useMemo(() => optionTabs(schema, { query, showAdvanced }), [schema, query, showAdvanced]);
  const visible = useMemo(() => visibleOptions(schema, { tab, query, showAdvanced }), [schema, tab, query, showAdvanced]);
  const advanced = useMemo(() => advancedCount(schema), [schema]);
  return { advanced, query, setQuery, setShowAdvanced, setTab, showAdvanced, tab, tabs, visible };
};

export { useOptionFilter };
