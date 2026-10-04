/* @layer electron-main @kind logic */
import { matchStage } from '@archipelia/engine';
import type { EngineProgress, Session } from '@archipelia/model';
import type { SessionEvent } from '@archipelia/sessions';
import { runJobId } from '../../src/jobs/run-job-id';
import type { RunJob, RunJobsDeps } from './run-jobs.type';
import { runJobSteps } from './run-job-steps';
import { runStepAt } from './run-step-at';
import { CLOSED_ERROR, ENDED_LINE, ENGINE_STEPS, HOST_LABELS, HOST_STEP, HOSTING_LINE, UNFINISHED } from './run-steps.constants';

const moveTo = (run: RunJob, step: string, line?: string) => {
  if (run.step === step) return;
  run.step = step;
  run.handle.step(step, line);
};

const advance = (run: RunJob, progress: EngineProgress) => {
  const at = runStepAt(progress);
  moveTo(run, at.step);
  run.handle.progress(at.fraction, at.line);
};

const createRunJobs = ({ job, cancel }: RunJobsDeps) => {
  const running = new Map<string, RunJob>();

  const begin = (session: Session, cancellable: boolean): RunJob => {
    const handle = job(runJobId(session.id), runJobSteps(session), { title: `Running ${session.snapshot.name}`, cancellable });
    if (cancellable) handle.signal.addEventListener('abort', () => { void cancel(session.id); });
    const run: RunJob = { handle, step: null };
    moveTo(run, ENGINE_STEPS[0]?.id ?? HOST_STEP);
    running.set(session.id, run);
    return run;
  };

  const settle = (run: RunJob, session: Session) => {
    if (session.status === 'generating') return;
    if (session.status === 'failed') run.handle.fail(new Error(session.error ?? 'The run failed'));
    else moveTo(run, HOST_STEP, HOST_LABELS[session.snapshot.host.kind]);
    if (session.status === 'hosting') run.handle.done(HOSTING_LINE);
    if (session.status === 'stopped') run.handle.done(ENDED_LINE);
    if (session.status !== 'starting') running.delete(session.id);
  };

  const onSession = (session: Session) => {
    const run = running.get(session.id) ?? (session.status === 'generating' ? begin(session, true) : undefined);
    if (run) settle(run, session);
  };

  const onEvent = (event: SessionEvent) => {
    if (event.type === 'session') return onSession(event.session);
    const run = running.get(event.sessionId);
    if (!run) return undefined;
    if (event.type === 'progress') return advance(run, event.progress);
    return run.handle.log(event.type === 'log' ? event.line.text : event.line);
  };

  const replay = (session: Session, generateLog: string | null) => {
    const run = begin(session, false);
    for (const line of (generateLog ?? '').split(/\r?\n/).filter((text) => text.trim())) {
      run.handle.log(line);
      const progress = matchStage(line);
      if (progress) advance(run, progress);
    }
    const ended = UNFINISHED.has(session.status) ? { ...session, status: 'failed' as const, error: CLOSED_ERROR } : session;
    if (ended.status === 'failed' && session.output) moveTo(run, HOST_STEP, HOST_LABELS[session.snapshot.host.kind]);
    settle(run, ended);
    running.delete(session.id);
  };

  return { onEvent, replay };
};

export { createRunJobs };
