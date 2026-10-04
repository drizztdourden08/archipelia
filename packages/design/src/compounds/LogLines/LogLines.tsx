/* @layer renderer-app @kind component */
import { LogPanel } from '@drizztdourden08/tessera/composites';
import { Stack, Tabs } from '@drizztdourden08/tessera/primitives';
import type { LogLinesProps } from './LogLines.type';
import './LogLines.css';

const LogLines = (props: LogLinesProps) => {
  const { rows, search, onSearchChange, emptyLabel, countLabel = 'lines', tabs, activeTab, onTabChange, copyText } = props;
  return (
    <Stack gap="sm" className="log-lines">
      {tabs && activeTab && onTabChange && <Tabs tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />}
      <LogPanel
        rows={rows}
        className="log-lines__panel"
        search={search}
        onSearchChange={onSearchChange}
        copyText={copyText}
        countLabel={countLabel}
        emptyLabel={emptyLabel}
      />
    </Stack>
  );
};

export { LogLines };
