/* @layer renderer-app @kind logic */
import type { EngineStatus } from '@archipelia/model';

const needsEngineSetup = (status: EngineStatus | null) => status !== null && status.state !== 'ready';

export { needsEngineSetup };
