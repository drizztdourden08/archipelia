/* @layer renderer-app @kind types */
import type { Session } from '@archipelia/model';

type RunsListProps = {
  runs: readonly Session[];
  total: number;
  loading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export type { RunsListProps };
