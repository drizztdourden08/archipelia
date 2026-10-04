/* @layer renderer-app @kind component */
import { LogPanel } from '@drizztdourden08/tessera/composites';
import { Stack, Tabs } from '@drizztdourden08/tessera/primitives';
import { LOG_KINDS } from './LogLines.constants';
import { logCopyText } from './behavior/log-copy-text';
import type { LogLinesProps } from './LogLines.type';

const LogLines = (props: LogLinesProps) => {
  const { rows, search, onSearchChange, emptyLabel, countLabel = 'lines', tabs, activeTab, onTabChange, copyText = logCopyText, toolbarExtra, placeholder } = props;
  return (
    <Stack gap="sm">
      {tabs && activeTab && onTabChange && <Tabs tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />}
      {placeholder ?? (
        <LogPanel
          height="fill"
          rows={rows}
          kinds={LOG_KINDS}
          search={search}
          onSearchChange={onSearchChange}
          copyText={copyText}
          countLabel={countLabel}
          emptyLabel={emptyLabel}
          toolbarExtra={toolbarExtra}
        />
      )}
    </Stack>
  );
};

export { LogLines };
