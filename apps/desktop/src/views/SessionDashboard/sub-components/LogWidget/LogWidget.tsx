/* @layer renderer-app @kind component */
import { Box } from '@drizztdourden08/tessera/primitives';
import type { LogWidgetProps } from './LogWidget.type';
import { useLogTabs } from '../../behavior/useLogTabs';
import { LogLines } from '../../../../compounds/LogLines';

const LogWidget = ({ session, lines }: LogWidgetProps) => {
  const log = useLogTabs(session, lines);
  return (
    <Box className="session-panel session-panel--fill">
      <LogLines
        tabs={log.tabs}
        activeTab={log.tab}
        onTabChange={log.changeTab}
        rows={log.rows}
        search={log.search}
        onSearchChange={log.setSearch}
        copyText={log.copyText}
        emptyLabel={log.emptyLabel}
      />
    </Box>
  );
};

export { LogWidget };
