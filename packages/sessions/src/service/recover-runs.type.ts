/* @layer core @kind types */
import type { DataFiles, Session } from '@archipelia/model';
import type { RunStore } from '../store/session-stores.type';
import type { LiveSession } from './service-deps.type';

type RecoverRuns = {
  files: DataFiles;
  runs: RunStore;
  live: ReadonlyMap<string, LiveSession>;
  update: (session: Session, patch: Partial<Session>) => Promise<Session>;
};

export type { RecoverRuns };
