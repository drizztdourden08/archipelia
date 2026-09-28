/* @layer renderer-app @kind logic */
import type { EngineStatus } from '@archipelia/model';

const needsEngineSetup = (status: EngineStatus | null) => status?.state === 'missing' || status?.state === 'failed';

export { needsEngineSetup };
