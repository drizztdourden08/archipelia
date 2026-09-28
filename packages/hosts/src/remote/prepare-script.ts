/* @layer core @kind logic */
import type { RemoteLayout } from './remote-layout.type';
import { shellQuote } from './shell-quote';
import { enterDir } from './enter-dir';
import { ALIVE } from './session-scripts.constants';

const prepareScript = (layout: RemoteLayout) =>
  [`umask 077 && mkdir -p ${shellQuote(layout.dir)}`, enterDir(layout), ...ALIVE, 'if alive; then echo "a server already runs for this session" >&2; exit 3; fi', 'rm -f host.yaml console server.pid run.sh'].join('\n');

export { prepareScript };
