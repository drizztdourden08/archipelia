/* @layer core @kind types */
import type { EngineRuntime } from '@archipelia/model';

type StoredRuntime = Omit<EngineRuntime, 'id' | 'apCommit' | 'pythonVersion'> & Partial<Pick<EngineRuntime, 'id' | 'apCommit' | 'pythonVersion'>>;

export type { StoredRuntime };
