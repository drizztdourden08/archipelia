/* @layer core @kind types */
import type { HostBinding, SessionHost } from '@archipelia/hosts';
import type { EngineRuntime, HostTarget } from '@archipelia/model';

type HostFor = (target: HostTarget, runtime?: EngineRuntime, binding?: HostBinding) => Promise<SessionHost>;

export type { HostFor };
