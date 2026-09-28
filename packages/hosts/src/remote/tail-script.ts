/* @layer core @kind logic */
import type { RemoteLayout } from './remote-layout.type';
import { enterDir } from './enter-dir';

const tailScript = (layout: RemoteLayout) => [
  enterDir(layout),
  'i=0; while [ ! -s server.pid ] && [ "$i" -lt 100 ]; do sleep 0.1; i=$((i+1)); done',
  'exec tail --pid="$(cat server.pid)" -n +1 -F server.log',
].join('\n');

export { tailScript };
