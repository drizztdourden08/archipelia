/* @layer renderer-app @kind hook */
import { useCallback, useMemo, useState } from 'react';
import type { Session } from '@archipelia/model';
import type { HostLogLine } from '@archipelia/hosts';
import { LOG_TAB_LABEL } from '../SessionDashboard.constants';
import { logTabsFor } from './log-tabs-for';
import { rowsText } from './rows-text';
import { serverRows } from './server-rows';
import { textFileFor } from './text-file-for';
import { textRows } from './text-rows';
import type { LogTab } from '../SessionDashboard.type';
import { useSessionText } from './useSessionText';

const useLogTabs = (session: Session, lines: readonly HostLogLine[]) => {
  const [tab, setTab] = useState<LogTab>('server');
  const [search, setSearch] = useState('');
  const text = useSessionText(session.id, textFileFor(tab, session));
  const spoiler = session.output?.spoiler;
  const tabs = useMemo(() => logTabsFor(session).map((id) => ({ id, label: LOG_TAB_LABEL[id] })), [spoiler]);
  const rows = useMemo(() => (tab === 'server' ? serverRows(lines) : textRows(text.value)), [tab, lines, text.value]);
  const changeTab = useCallback((id: string) => setTab(id as LogTab), []);
  const copyText = useCallback(() => rowsText(rows), [rows]);
  const idleLabel = tab === 'server' ? 'The server has not written anything yet.' : 'This file is empty or missing.';
  const emptyLabel = text.loading ? 'Loading' : idleLabel;
  return { tab, tabs, changeTab, rows, search, setSearch, copyText, emptyLabel };
};

export { useLogTabs };
