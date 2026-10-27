/* @layer tests @kind test */
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, test, vi } from 'vitest';
import type { ProcessJobs } from '@drizztdourden08/brock-electron/main';
import type { ProcessJobOutcome } from '@drizztdourden08/brock-core/types';
import { BUILD_JOB } from '@archipelia/model';
import { createBuildRunner } from '../../electron/builds/create-build-runner';
import { defineBuildProcesses } from '../../electron/builds/define-build-processes';

const ID = '123e4567-e89b-42d3-a456-426614174000';

type Stored = { label: string; timeoutMs: number | undefined; allow: unknown; parse: (raw: unknown) => unknown; resolve: (raw: unknown) => unknown };

const fakeProcesses = (outcome: ProcessJobOutcome = { status: 'done', exitCode: 0, tail: [] }) => {
  const defined = new Map<string, Stored>();
  const define: ProcessJobs['define'] = (id, def) => {
    defined.set(id, {
      label: def.label,
      timeoutMs: def.timeoutMs,
      allow: def.allow,
      parse: def.parse,
      resolve: (raw) => def.resolve(def.parse(raw), undefined as never),
    });
  };
  const start = vi.fn<ProcessJobs['start']>(() => Promise.resolve(outcome));
  return { define, start, defined };
};

const SPEC = { command: 'python', args: [], cwd: 'work', env: {} };

describe('the processes of a build', () => {
  test('declares the venv, the tools and the wheel step with a label and a time limit, and nothing else', () => {
    const { define, defined } = fakeProcesses();
    defineBuildProcesses({ define }, () => Promise.resolve(SPEC));
    expect([...defined.keys()]).toEqual([BUILD_JOB.venv, BUILD_JOB.tools, BUILD_JOB.wheel]);
    for (const stored of defined.values()) {
      expect(stored.label).toMatch(/\w/);
      expect(stored.timeoutMs).toBeGreaterThan(0);
      expect(stored.allow).toEqual({ env: ['PATH'] });
    }
  });

  test('takes only a build id from the renderer and lets the app build the command', () => {
    const { define, defined } = fakeProcesses();
    const specOf = vi.fn(() => Promise.resolve(SPEC));
    defineBuildProcesses({ define }, specOf);
    const wheel = defined.get(BUILD_JOB.wheel) as Stored;
    expect(wheel.parse({ buildId: ID })).toEqual({ buildId: ID });
    for (const raw of [undefined, 'x', { buildId: 'x' }, 'cmd.exe', { command: 'cmd.exe', args: ['/c', 'calc'] }]) {
      expect(() => wheel.parse(raw)).toThrow('not valid');
    }
    wheel.resolve({ buildId: ID });
    expect(specOf).toHaveBeenCalledWith('wheel', { buildId: ID });
  });

  test('reads every line of the step from its log file and starts the step by its id with the build id only', async () => {
    const logFile = join(mkdtempSync(join(tmpdir(), 'archipelia-build-')), 'wheel.log');
    writeFileSync(logFile, 'first\r\nsecond\n\nthird\n');
    const outcome: ProcessJobOutcome = { status: 'failed', exitCode: 1, tail: ['tail line'], error: 'exited', logFile };
    const { start } = fakeProcesses(outcome);
    const run = await createBuildRunner({ start })('wheel', ID);
    expect(start).toHaveBeenCalledWith(BUILD_JOB.wheel, { buildId: ID });
    expect(run).toEqual({ status: 'failed', code: 1, lines: ['first', 'second', 'third'], error: 'exited' });
  });

  test.each<[ProcessJobOutcome, string]>([
    [{ status: 'done', exitCode: 0, tail: [] }, 'done'],
    [{ status: 'cancelled', exitCode: null, tail: [] }, 'cancelled'],
    [{ status: 'rejected', error: 'No such process job.' }, 'rejected'],
    [{ status: 'detached', exitCode: null, tail: ['x'], error: 'could not stop' }, 'failed'],
  ])('maps the outcome %j to %s', async (outcome, status) => {
    const { start } = fakeProcesses(outcome);
    const run = await createBuildRunner({ start })('venv', ID);
    expect(run.status).toBe(status);
  });

  test('falls back to the tail when the log file is missing or unreadable', async () => {
    const outcome: ProcessJobOutcome = { status: 'failed', exitCode: 1, tail: ['tail line'], error: 'exited', logFile: join(tmpdir(), 'archipelia-no-such-build.log') };
    const { start } = fakeProcesses(outcome);
    const run = await createBuildRunner({ start })('wheel', ID);
    expect(run.lines).toEqual(['tail line']);
  });
});
