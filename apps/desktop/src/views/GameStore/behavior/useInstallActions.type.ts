/* @layer renderer-app @kind types */
import type { KeyedGuard } from '@drizztdourden08/brock-react';
import type { GameRow } from '../GameStore.type';

type InstallActionsParams = {
  guard: KeyedGuard['guard'];
  rows: GameRow[];
};

export type { InstallActionsParams };
