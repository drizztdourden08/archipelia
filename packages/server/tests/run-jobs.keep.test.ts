/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import type { JobHandle, StartJob } from '@drizztdourden08/brock-core/jobs';
import type { Session, SessionTemplate } from '@archipelia/model';
import { createRunJobs } from '../src/core/runs/create-run-jobs';
import { runJobSteps } from '../src/core/runs/run-job-steps';
import { runStepAt } from '../src/core/runs/run-step-at';

const template = (id: string): SessionTemplate => ({
  id, name: 'New session', players: [], updatedAt: 0, host: { kind: 'local', port: 38281 },
  generator: { spoiler: 3, race: false, progressionBalancing: true },
  server: { hintCost: 10, releaseMode: 'auto', collectMode: 'auto', remainingMode: 'goal', autoShutdownMinutes: 0 },
});

const run = (id: string, templateId: string, createdAt: number, patch: Partial<Session> = {}): Session => ({
  id, templateId, createdAt, status: 'generating', snapshot: template(templateId), ...patch,
});

const fakeJobs = () => {
  const calls: string[] = [];
  const job: StartJob = (id, steps, options) => {
    calls.push(`start ${id} ${options?.title ?? ''} ${steps.map((step) => step.id).join(',')}`);
    const handle: JobHandle = {
      id, signal: new AbortController().signal, started: Promise.resolve(), ended: Promise.resolve('done'),
      step: (step, line) => calls.push(`step ${step}${line ? ` ${line}` : ''}`),
      progress: (fraction, line) => calls.push(`progress ${fraction.toFixed(2)} ${line ?? ''}`),
      line: (text) => calls.push(`line ${text}`),
      log: (message) => calls.push(`log ${message}`),
      skip: (step) => calls.push(`skip ${step}`),
      setCancellable: (on) => calls.push(`cancellable ${on}`),
      done: (line) => calls.push(`done ${line ?? ''}`),
      fail: (error) => calls.push(`fail ${(error as Error).message}`),
      run: (work) => work(handle),
    };
    return handle;
  };
  return { calls, job };
};

describe('run job steps', () => {
  test('the engine stages fold into five steps and the host step', () => {
    const steps = runJobSteps(run('a', 't', 0));
    expect(steps.map((step) => step.id)).toEqual(['roll', 'worlds', 'rules', 'fill', 'output', 'host']);
    expect(steps[0]?.label).toBe('Rolling 0 player files');
    expect(steps[5]?.label).toBe('Starting the local server');
  });

  test('a stage gives its step, its share of the step and the line', () => {
    expect(runStepAt({ stage: 'fill', done: 50, total: 100 })).toEqual({ step: 'fill', fraction: 0.25, line: 'Filling the multiworld · 50 / 100 items' });
    expect(runStepAt({ stage: 'balance' })).toEqual({ step: 'fill', fraction: 0.5, line: 'Balancing progression' });
    expect(runStepAt({ stage: 'output', done: 1, total: 2 }).line).toBe('Writing the output files · 1 / 2');
  });
});

describe('run jobs', () => {
  test('a live run walks its steps and ends when the room hosts', () => {
    const { calls, job } = fakeJobs();
    const jobs = createRunJobs({ job, cancel: () => Promise.resolve() });
    const session = run('s1', 't', 0, { snapshot: { ...template('t'), name: 'Saturday' } });
    jobs.onEvent({ type: 'session', session });
    jobs.onEvent({ type: 'generate', sessionId: 's1', line: 'Generating' });
    jobs.onEvent({ type: 'progress', sessionId: 's1', progress: { stage: 'fill', done: 1, total: 4 } });
    jobs.onEvent({ type: 'session', session: { ...session, status: 'starting' } });
    jobs.onEvent({ type: 'session', session: { ...session, status: 'hosting' } });
    jobs.onEvent({ type: 'generate', sessionId: 's1', line: 'after the end' });
    expect(calls).toEqual([
      'start archipelia-run-s1 Running Saturday roll,worlds,rules,fill,output,host',
      'step roll',
      'log Generating',
      'step fill',
      'progress 0.13 Filling the multiworld · 1 / 4 items',
      'step host Starting the local server',
      'done The server is up',
    ]);
  });

  test('a past run replays its log and fails where it stopped', () => {
    const { calls, job } = fakeJobs();
    const jobs = createRunJobs({ job, cancel: () => Promise.resolve() });
    jobs.replay(run('s2', 't', 0, { status: 'failed', error: 'boom' }), 'line one\n\nline two\n');
    expect(calls.slice(1)).toEqual(['step roll', 'log line one', 'log line two', 'fail boom']);
  });
});
