/* @layer renderer-app @kind types */
import type { StatusTone } from '@drizztdourden08/tessera/primitives';

type RunStatusView = { label: string; tone: StatusTone };

type NetworkPlace = { host?: string; ip?: string; port?: number };

export type { NetworkPlace, RunStatusView };
