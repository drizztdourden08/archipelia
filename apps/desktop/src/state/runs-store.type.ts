/* @layer renderer-app @kind types */
import type { EngineProgress, Session, SessionTemplate } from '@archipelia/model';
import type { HostLogLine } from '@archipelia/hosts';
import type { SessionEvent } from '@archipelia/sessions';

type RunsState = {
  runs: Session[];
  progress: Record<string, EngineProgress>;
  logs: Record<string, HostLogLine[]>;
  generateLines: Record<string, string[]>;
  load: () => Promise<void>;
  run: (template: SessionTemplate) => Promise<Session>;
  stop: (id: string) => Promise<void>;
  cancel: (id: string) => Promise<void>;
  command: (id: string, cmd: string) => Promise<void>;
  loadLog: (id: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
  apply: (event: SessionEvent) => void;
};

export type { RunsState };
