/* @layer renderer-app @kind types */
import type { StorageSummary } from '@drizztdourden08/brock-core/platform';

type DataOverviewProps = { summary: StorageSummary | null; onReveal: () => void };

export type { DataOverviewProps };
