/* @layer renderer-app @kind logic */
import type { Run } from './step-problems.type';

const ASKED = ({ props, view }: Run): boolean => view.asking || props.finish.kind === 'done';

const BUILT = ({ props, view }: Run): boolean => view.asking || view.stage?.kind === 'built' || props.finish.kind === 'running' || props.finish.kind === 'done';

const PREPARED = ({ view }: Run): boolean => {
  const kind = view.stage?.kind;
  return kind !== undefined && kind !== 'preparing' && kind !== 'failed';
};

const BUILD_ENDED = (run: Run): boolean => BUILT(run) || run.view.stage?.kind === 'missing' || run.view.stage?.kind === 'paused';

const ADVANCE: Record<string, (run: Run) => boolean> = {
  'fetch-wheel': ASKED,
  'fetch-pypi': ASKED,
  prepare: PREPARED,
  build: BUILD_ENDED,
  tool: BUILT,
  check: ASKED,
  install: ({ props }) => props.finish.kind === 'done',
};

export { ADVANCE };
