/* @layer renderer-app @kind logic */
import type { EngineProgress, Session, SessionStatus } from '@archipelia/model';
import type { RunLaunch, RunViewInput } from '../RunProgress.type';
import { stepsOf } from './steps-of';
import { lineOf } from './line-of';
import { percentOf } from './percent-of';
import { FAILED_MIN_PERCENT } from '../RunProgress.constants';
import { isWorking } from './is-working';

const stepsFor = (session: Session | undefined, launch: RunLaunch | null, progress: EngineProgress | undefined) => {
  const snapshot = session?.snapshot ?? launch?.template;
  return stepsOf(session?.status, progress, snapshot?.players.length ?? 0, snapshot?.host);
};

const lineFor = (launch: RunLaunch | null, status: SessionStatus | undefined, progress: EngineProgress | undefined) =>
  (launch?.error ? 'The run did not start' : lineOf(status, progress));

const runView = ({ session, launch, progress, failed }: RunViewInput) => {
  const status = session?.status;
  const percent = percentOf(status, progress);
  return {
    error: session?.error ?? launch?.error,
    line: lineFor(launch, status, progress),
    percent: failed ? Math.max(percent, FAILED_MIN_PERCENT) : percent,
    seed: session?.seed,
    steps: stepsFor(session, launch, progress),
    working: !failed && isWorking(session),
  };
};

export { runView };
