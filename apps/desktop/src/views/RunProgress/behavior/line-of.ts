/* @layer renderer-app @kind logic */
import type { EngineProgress, SessionStatus } from '@archipelia/model';
import { STAGE_LINES } from '../RunProgress.constants';

const countsOf = (progress: EngineProgress, unit: string) =>
  (progress.done !== undefined && progress.total ? ` · ${progress.done} / ${progress.total}${unit}` : '');

const lineOf = (status: SessionStatus | undefined, progress: EngineProgress | undefined): string => {
  if (status === 'starting') return 'Starting the server';
  if (status === 'hosting') return 'The server is up';
  if (status === 'failed') return 'The run failed';
  if (!progress) return 'Waiting for the generator';
  return `${STAGE_LINES[progress.stage]}${countsOf(progress, progress.stage === 'fill' ? ' items' : '')}`;
};

export { lineOf };
