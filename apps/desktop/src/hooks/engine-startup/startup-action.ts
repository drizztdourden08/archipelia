/* @layer renderer-app @kind logic */
import type { StartupDecision } from '@archipelia/model';

const startupAction = (decision: StartupDecision, checkAtStart: boolean): StartupDecision => (
  decision.kind === 'offer' && !checkAtStart ? { kind: 'none' } : decision
);

export { startupAction };
