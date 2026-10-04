/* @layer renderer-app @kind logic */
import type { Session } from '@archipelia/model';

const isWorking = (run: Session) => run.status === 'generating' || run.status === 'starting';

export { isWorking };
