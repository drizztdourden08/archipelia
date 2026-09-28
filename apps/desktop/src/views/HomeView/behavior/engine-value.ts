/* @layer renderer-app @kind logic */
import type { EngineStatus } from '@archipelia/model';

const engineValue = (status: EngineStatus | null) => status?.apVersion ?? status?.state ?? '-';

export { engineValue };
