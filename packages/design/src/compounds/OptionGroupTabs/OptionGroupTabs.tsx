/* @layer renderer-app @kind component */
import { useMemo } from 'react';
import { FilterBar } from '@drizztdourden08/tessera/composites';
import { Stack, Tabs, Toggle } from '@drizztdourden08/tessera/primitives';
import type { OptionGroupTabsProps } from './OptionGroupTabs.type';

const OptionGroupTabs = (props: OptionGroupTabsProps) => {
  const { tabs, activeTab, onTabChange, query, onQueryChange, showAdvanced, onShowAdvancedChange, advancedCount } = props;
  const items = useMemo(() => tabs.map((tab) => ({ id: tab.id, label: tab.label, badge: tab.count })), [tabs]);
  return (
    <Stack gap="sm">
      <FilterBar
        search={query}
        onSearchChange={onQueryChange}
        searchPlaceholder="Search options"
        searchLabel="Search options"
        extra={advancedCount > 0
          ? <Toggle checked={showAdvanced} onChange={onShowAdvancedChange} label={`Show advanced (${advancedCount})`} />
          : undefined}
      />
      <Tabs tabs={items} activeTab={activeTab} onTabChange={onTabChange} />
    </Stack>
  );
};

export { OptionGroupTabs };
