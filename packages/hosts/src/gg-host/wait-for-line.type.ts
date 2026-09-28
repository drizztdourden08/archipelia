/* @layer core @kind types */
import type { HostListener } from '../session-host.type';

type LineSource = { subscribe: (listener: HostListener) => () => void };

type LineWait = { pattern: RegExp; timeoutMs: number; what: string; since?: number; signal?: AbortSignal };

export type { LineSource, LineWait };
