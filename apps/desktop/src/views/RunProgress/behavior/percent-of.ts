/* @layer renderer-app @kind logic */
import type { EngineProgress, SessionStatus } from '@archipelia/model';
import { STAGE_BANDS, STARTING } from '../RunProgress.constants';

const fractionOf = ({ done, total }: EngineProgress) =>
  (done !== undefined && total ? Math.min(1, Math.max(0, done / total)) : 0);

const percentOf = (status: SessionStatus | undefined, progress: EngineProgress | undefined): number => {
  if (status === 'hosting') return 100;
  if (status === 'starting') return STARTING;
  if (!progress) return 0;
  const band = STAGE_BANDS[progress.stage];
  return Math.round(band.from + (band.to - band.from) * fractionOf(progress));
};

export { percentOf };
