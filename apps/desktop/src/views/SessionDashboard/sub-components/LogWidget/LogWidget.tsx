/* @layer renderer-app @kind component */
import type { LogWidgetProps } from './LogWidget.type';
import { useLogTabs } from '../../behavior/useLogTabs';
import { LogLines } from '@archipelia/design';
import { TextState } from '../TextState';

const LogWidget = ({ session, lines }: LogWidgetProps) => {
  const log = useLogTabs(session.id, lines);
  const { text } = log;
  return (
    <LogLines
      tabs={log.tabs}
      activeTab={log.tab}
      onTabChange={log.changeTab}
      rows={log.rows}
      search={log.search}
      onSearchChange={log.setSearch}
      emptyLabel={log.emptyLabel}
      placeholder={text.loading || text.failed ? <TextState failed={text.failed} loadingLabel="Loading the log" onRetry={text.retry} /> : undefined}
    />
  );
};

export { LogWidget };
