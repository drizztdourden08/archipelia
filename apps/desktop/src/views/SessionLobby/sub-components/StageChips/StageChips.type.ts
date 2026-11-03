/* @layer renderer-app @kind types */
import type { AdminLobby, RunOverride } from '@archipelia/model';

type StageChipsProps = {
  lobby?: AdminLobby;
  serverId: string;
  direct: boolean;
  changes: readonly RunOverride[];
  count: number;
  problems: number;
};

export type { StageChipsProps };
