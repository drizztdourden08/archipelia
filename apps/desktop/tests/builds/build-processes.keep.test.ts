/* @layer tests @kind test */
import { describe, expect, test, vi } from 'vitest';
import type { ProcessJobs } from '@drizztdourden08/brock-electron/main';
import type { ProcessJobOutcome } from '@drizztdourden08/brock-core/types';
import { BUILD_JOB } from '@archipelia/model';
import { createBuildLines } from '../../electron/builds/create-build-lines';
import { createBuildRunner } from '../../electron/builds/create-build-runner';
import { defineBuildProcesses } from '../../electron/builds/define-build-processes';

const ID = '123e4567-e89b-42d3-a456-426614174000';

type Stored = { label: string; timeoutMs: number | undefined; parse: (raw: unknown) => unknown; resolve: (raw: unknown) => unknown; progress: (line: string) => void };

const fakeProcesses = (outcome: ProcessJobOutcome = { status: 'done', exitCode: 0, tail: [] }) => {
  const defined = new Map<string, Stored>();
  const define: ProcessJobs['define'] = (id, def) => {
    defined.set(id, {
      label: def.label,
      timeoutMs: def.timeoutMs,
      parse: def.parse,
      resolve: (raw) => def.resolve(def.parse(raw), undefined as never),
      progress: (line) => { def.progress?.(line, 'stdout'); },
    });
  };
  const start = vi.fn<ProcessJobs['start']>(() => Promise.resolve(outcome));
  return { define, start, defined };
};

const SPEC = { command: 'python', args: [], cwd: 'work', env: {} };

describe('the processes of a build', () => {
  test('declares the venv, the tools and the wheel step with a label and a time limit, and nothing else', () => {
    const { define, defined } = fakeProcesses();
    defineBuildProcesses({ define }, () => SPEC, createBuildLines());
    expect([...defined.keys()]).toEqual([BUILD_JOB.venv, BUILD_JOB.tools, BUILD_JOB.wheel]);
    for (const stored of defined.values()) {
      expect(stored.label).toMatch(/\w/);
      expect(stored.timeoutMs).toBeGreaterThan(0);
    }
  });

  test('takes only a build id from the renderer and lets the app build the command', () => {
    const { define, defined } = fakeProcesses();
    const specOf = vi.fn(() => SPEC);
    defineBuildProcesses({ define }, specOf, createBuildLines());
    const wheel = defined.get(BUILD_JOB.wheel) as Stored;
    expect(wheel.parse({ buildId: ID })).toEqual({ buildId: ID });
    for (const raw of [undefined, 'x', { buildId: 'x' }, 'cmd.exe', { command: 'cmd.exe', args: ['/c', 'calc'] }]) {
      expect(() => wheel.parse(raw)).toThrow('not valid');
    }
    wheel.resolve({ buildId: ID });
    expect(specOf).toHaveBeenCalledWith('wheel', { buildId: ID });
  });

  test('keeps every line of the step for the diagnosis and starts the step by its id with the build id only', async () => {
    const { define, defined, start } = fakeProcesses();
    const lines = createBuildLines();
    defineBuildProcesses({ define }, () => SPEC, lines);
    start.mockImplementation(() => {
      const wheel = defined.get(BUILD_JOB.wheel) as Stored;
      wheel.progress('first');
      wheel.progress('second');
      return Promise.resolve<ProcessJobOutcome>({ status: 'failed', exitCode: 1, tail: ['tail line'], error: 'exited' });
    });
    const run = await createBuildRunner({ start }, lines)('wheel', ID);
    expect(start).toHaveBeenCalledWith(BUILD_JOB.wheel, { buildId: ID });
    expect(run).toEqual({ status: 'failed', code: 1, lines: ['first', 'second'], error: 'exited' });
  });

  test.each<[ProcessJobOutcome, string]>([
    [{ status: 'done', exitCode: 0, tail: [] }, 'done'],
    [{ status: 'cancelled', exitCode: null, tail: [] }, 'cancelled'],
    [{ status: 'rejected', error: 'No such process job.' }, 'rejected'],
    [{ status: 'detached', exitCode: null, tail: ['x'], error: 'could not stop' }, 'failed'],
  ])('maps the outcome %j to %s', async (outcome, status) => {
    const { start } = fakeProcesses(outcome);
    const run = await createBuildRunner({ start }, createBuildLines())('venv', ID);
    expect(run.status).toBe(status);
  });

  test('forgets the lines of the last run when a step starts again, and keeps a bounded number', () => {
    const lines = createBuildLines();
    lines.reset('a');
    lines.add('a', 'one');
    lines.reset('a');
    expect(lines.take('a')).toEqual([]);
    lines.add('b', 'ignored');
    expect(lines.take('b')).toEqual([]);
    for (let at = 0; at < 4100; at += 1) lines.add('a', `line ${at}`);
    expect(lines.take('a')).toHaveLength(4000);
    expect(lines.take('a').at(-1)).toBe('line 4099');
  });
});
