/* @layer tests @kind fixture */
import { vi } from 'vitest';
import type { ProcessJobs } from '@drizztdourden08/brock-electron/main';
import type { ProcessJobOutcome } from '@drizztdourden08/brock-core/types';

type Stored = {
  label: string;
  elevate: string | undefined;
  successCodes: readonly number[] | undefined;
  timeoutMs: number | undefined;
  allow: unknown;
  parse: (raw: unknown) => unknown;
  resolve: (raw: unknown) => unknown;
  progress: (line: string) => void;
};

const fakeProcesses = (outcome: ProcessJobOutcome = { status: 'done', exitCode: 0, tail: [] }) => {
  const defined = new Map<string, Stored>();
  const define: ProcessJobs['define'] = (id, def) => {
    defined.set(id, {
      label: def.label,
      elevate: def.elevate,
      successCodes: def.successCodes,
      timeoutMs: def.timeoutMs,
      allow: def.allow,
      parse: def.parse,
      resolve: (raw) => def.resolve(def.parse(raw), undefined as never),
      progress: (line) => { def.progress?.(line, 'stdout'); },
    });
  };
  const start = vi.fn<ProcessJobs['start']>(() => Promise.resolve(outcome));
  return { define, start, defined };
};

export type { Stored };
export { fakeProcesses };
