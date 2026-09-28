/* @layer renderer-app @kind logic */
import type { SessionStatus } from '@archipelia/model';

const canStop = (status: SessionStatus) => status === 'hosting' || status === 'starting' || status === 'generating';

export { canStop };
