/* @layer core @kind types */
import type { ServerMessage } from '@drizztdourden08/archipelia-lobby-protocol';

type Dismissal = { admission: 'refused' | 'removed'; reason?: string; message: ServerMessage; queued?: boolean };

export type { Dismissal };
