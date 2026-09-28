/* @layer core @kind types */
import type { createLogHub } from './log-hub';

type LogHub = ReturnType<typeof createLogHub>;

export type { LogHub };
