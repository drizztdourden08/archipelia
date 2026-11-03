/* @layer renderer-app @kind types */
import type { PlayerRow } from '../../History.type';

type PlayersSectionProps = {
  rows: readonly PlayerRow[];
  summary: string | null;
};

export type { PlayersSectionProps };
