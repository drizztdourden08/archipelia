/* @layer core @kind types */
import type { ServerMessage } from '@archipelia/lobby-protocol';

type Dismissal = { admission: 'refused' | 'removed'; reason?: string; message: ServerMessage };

export type { Dismissal };
