/* @layer core @kind types */
import type { Endpoint, HostTarget, ServerSettings } from '@archipelia/model';

type HostLogLine = { at: number; text: string };

type HostStart = {
  sessionId: string;
  sessionDir: string;
  seedFile: string;
  server: ServerSettings;
  password?: string;
  signal?: AbortSignal;
};

type HostListener = (line: HostLogLine) => void;

interface SessionHost {
  readonly kind: HostTarget['kind'];
  start: (input: HostStart) => Promise<Endpoint>;
  command: (cmd: string) => Promise<void>;
  onLog: (listener: HostListener) => () => void;
  stop: () => Promise<void>;
}

export type { HostListener, HostLogLine, HostStart, SessionHost };
