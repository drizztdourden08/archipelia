/* @layer core @kind types */
import type { SessionHost } from '@archipelia/hosts';
import type { EngineRuntime, HostTarget } from '@archipelia/model';

type HostFor = (target: HostTarget, runtime?: EngineRuntime) => Promise<SessionHost>;

export type { HostFor };
