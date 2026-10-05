/* @layer renderer-app @kind logic */
import { contexts, defineBootTask } from '@drizztdourden08/brock-react';
import { SESSION_CONTEXT } from '../stores/focus-store.constants';
import { sessionActive } from '../stores/session-active';
import { useFocusStore } from '../stores/useFocusStore';
import { useRunsStore } from '../stores/useRunsStore';

const publish = () => {
  const focused = useFocusStore.getState().sessionId;
  const active = sessionActive(focused, useRunsStore.getState().runs);
  const current = contexts.get<string>(SESSION_CONTEXT);
  if (current.active !== active || current.data !== focused) contexts.set(SESSION_CONTEXT, { active, data: focused });
};

export default defineBootTask({
  label: 'Following the focused session',
  after: ['settings'],
  run: ({ report }) => {
    useFocusStore.subscribe(publish);
    useRunsStore.subscribe(publish);
    publish();
    report(1);
  },
});
