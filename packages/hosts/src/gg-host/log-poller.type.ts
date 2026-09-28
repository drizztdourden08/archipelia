/* @layer core @kind types */
import type { GgClient } from '../archipelago-gg/client.type';
import type { createLogPoller } from './log-poller';

type LogPollerOptions = { client: GgClient; room: string; everyMs: number; onLine: (line: string) => void };

type LogPoller = ReturnType<typeof createLogPoller>;

export type { LogPoller, LogPollerOptions };
