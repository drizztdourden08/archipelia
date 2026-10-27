/* @layer renderer-app @kind logic */
import type { Session } from '@archipelia/model';
import type { RunStatusView } from '@archipelia/design';
import { RUN_STATUS } from '@archipelia/design';

const statusOf = (run: Session): RunStatusView => {
  const view = RUN_STATUS[run.status];
  if (run.status !== 'failed') return view;
  return { ...view, label: run.output ? view.label : 'Generation failed' };
};

export { statusOf };
