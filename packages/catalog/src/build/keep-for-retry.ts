/* @layer core @kind logic */
import type { SourceBuildEnd } from '@archipelia/model';
import type { ActiveBuild, BuildSession } from './build.type';

const keepForRetry = async (session: BuildSession, build: ActiveBuild, stopped: SourceBuildEnd): Promise<SourceBuildEnd> => {
  if (stopped.status === 'cancelled') await session.close();
  else build.phase = 'ready';
  return stopped;
};

export { keepForRetry };
