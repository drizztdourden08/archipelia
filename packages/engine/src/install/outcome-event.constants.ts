/* @layer core @kind config */
import type { EngineEvent, EngineInstallResult } from '@archipelia/model';

const OUTCOME_EVENT: Record<EngineInstallResult['outcome'], EngineEvent['kind'] | undefined> = {
  switched: 'switched',
  ready: 'installed',
  failed: 'failed',
  cancelled: undefined,
};

export { OUTCOME_EVENT };
