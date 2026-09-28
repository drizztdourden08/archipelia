/* @layer renderer-app @kind logic */
import type { Session } from '@archipelia/model';

const isWorking = (run: Session | undefined) => !run || run.status === 'generating' || run.status === 'starting';

export { isWorking };
