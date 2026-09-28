/* @layer renderer-app @kind logic */
import type { EngineProgress } from '@archipelia/model';

const progressLabel = (progress: EngineProgress | undefined) => {
  if (!progress) return null;
  const count = progress.total ? ` ${progress.done ?? 0}/${progress.total}` : '';
  return `${progress.stage}${count}`;
};

export { progressLabel };
