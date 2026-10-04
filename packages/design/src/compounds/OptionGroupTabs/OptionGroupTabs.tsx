/* @layer renderer-app @kind component */
import { useCallback, useMemo } from 'react';
import type { ChangeEvent } from 'react';
import { Box, Flex, Stack, Tabs, TextInput, Toggle } from '@drizztdourden08/tessera/primitives';
import type { OptionGroupTabsProps } from './OptionGroupTabs.type';
import './OptionGroupTabs.css';

const OptionGroupTabs = (props: OptionGroupTabsProps) => {
  const { tabs, activeTab, onTabChange, query, onQueryChange, showAdvanced, onShowAdvancedChange, advancedCount } = props;
  const items = useMemo(() => tabs.map((tab) => ({ id: tab.id, label: tab.label, badge: tab.count })), [tabs]);
  const handleQuery = useCallback((event: ChangeEvent<HTMLInputElement>) => onQueryChange(event.target.value), [onQueryChange]);
  return (
    <Stack gap="sm">
      <Flex gap="md" align="center" justify="between" wrap>
        <Box className="option-group-tabs__search">
          <TextInput type="search" placeholder="Search options" value={query} onChange={handleQuery} />
        </Box>
        {advancedCount > 0 && (
          <Toggle checked={showAdvanced} onChange={onShowAdvancedChange} label={`Show advanced (${advancedCount})`} />
        )}
      </Flex>
      <Tabs tabs={items} activeTab={activeTab} onTabChange={onTabChange} />
    </Stack>
  );
};

export { OptionGroupTabs };
