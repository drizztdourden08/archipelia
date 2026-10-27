/* @layer renderer-app @kind logic */
import { contexts, defineBootTask } from '@drizztdourden08/brock-react';
import { SESSION_CONTEXT } from '../stores/session-context.constants';
import { useLibraryStore } from '../stores/useLibraryStore';
import { useLiveStore } from '../stores/useLiveStore';

const publish = () => {
  const { tabs, activeId } = useLiveStore.getState();
  const tab = tabs.find((entry) => entry.tabId === activeId);
  const label = tab ? useLibraryStore.getState().templates.find((template) => template.id === tab.sessionId)?.name : undefined;
  const current = contexts.get<string>(SESSION_CONTEXT);
  const data = tab?.tabId;
  if (current.active !== (tab !== undefined) || current.data !== data || current.label !== label) contexts.set(SESSION_CONTEXT, { active: tab !== undefined, data, label });
};

export default defineBootTask({
  label: 'Following the active session tab',
  after: ['settings'],
  run: ({ report }) => {
    useLiveStore.subscribe(publish);
    useLibraryStore.subscribe(publish);
    publish();
    report(1);
  },
});
