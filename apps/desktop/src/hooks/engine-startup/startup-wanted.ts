/* @layer renderer-app @kind logic */
import type { EngineStatus } from '@archipelia/model';

const startupWanted = (checkAtStart: boolean, status: EngineStatus): boolean => checkAtStart || status.state !== 'ready';

export { startupWanted };
