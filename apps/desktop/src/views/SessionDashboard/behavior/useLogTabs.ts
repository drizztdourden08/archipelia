/* @layer renderer-app @kind hook */
import { useCallback, useMemo } from 'react';
import { useWidgetState } from '@drizztdourden08/brock-react';
import type { HostLogLine } from '@archipelia/hosts';
import { LOG_TAB_ITEMS, LOG_TABS } from '../SessionDashboard.constants';
import { serverRows } from './server-rows';
import { textFileFor } from './text-file-for';
import { textRows } from './text-rows';
import type { LogTab } from '../SessionDashboard.type';
import { useSessionText } from './useSessionText';

const useLogTabs = (sessionId: string, lines: readonly HostLogLine[]) => {
  const [chosen, setTab] = useWidgetState<LogTab>('tab', 'server');
  const tab = LOG_TABS.includes(chosen) ? chosen : 'server';
  const [search, setSearch] = useWidgetState('search', '');
  const text = useSessionText(sessionId, textFileFor(tab));
  const rows = useMemo(() => (tab === 'server' ? serverRows(lines) : textRows(text.value)), [tab, lines, text.value]);
  const changeTab = useCallback((id: string) => setTab(id as LogTab), [setTab]);
  const emptyLabel = tab === 'server' ? 'The server has not written anything yet.' : 'This file is empty or missing.';
  return { tab, tabs: LOG_TAB_ITEMS, changeTab, rows, search, setSearch, emptyLabel, text };
};

export { useLogTabs };
