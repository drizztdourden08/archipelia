/* @layer renderer-app @kind logic */
import type { Session } from '@archipelia/model';
import type { RunStatusView } from '@archipelia/design';
import { RUN_STATUS } from '@archipelia/design';
import { DATE_FORMAT, LIVE } from '../SessionsLibrary.constants';
import { hostTag } from './host-tag';

const statusOf = (session: Session): RunStatusView => {
  const view = RUN_STATUS[session.status];
  if (session.status !== 'failed') return view;
  return { ...view, label: session.output ? view.label : 'Generation failed' };
};

const runSummary = (session: Session) => ({
  id: session.id,
  when: DATE_FORMAT.format(session.createdAt),
  name: session.snapshot.name,
  host: hostTag(session.snapshot.host),
  status: statusOf(session),
  error: session.status === 'failed' ? session.error ?? 'no error message' : undefined,
  hasLog: session.status === 'failed',
  canDelete: !LIVE.includes(session.status),
});

export { runSummary };
