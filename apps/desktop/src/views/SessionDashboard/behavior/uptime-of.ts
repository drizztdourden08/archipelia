/* @layer renderer-app @kind logic */
import type { Session } from '@archipelia/model';
import { formatDuration } from './format-duration';

const uptimeOf = (session: Session, firstLineAt: number | undefined, now: number) =>
  (session.status === 'hosting' ? formatDuration(now - (firstLineAt ?? session.createdAt)) : null);

export { uptimeOf };
