/* @layer renderer-app @kind types */
import type { StorageSummary } from '@drizztdourden08/brock-core/platform';

type DataOverviewProps = {
  summary: StorageSummary | null;
  error: string | null;
  onRetry: () => void;
  onReveal: () => void;
};

export type { DataOverviewProps };
