/* @layer core @kind logic */
import type { RemoteLayout } from './remote-layout.type';
import { shellQuote } from './shell-quote';
import { enterDir } from './enter-dir';
import { ALIVE } from './session-scripts.constants';

const consoleScript = (layout: RemoteLayout, cmd: string) => {
  if (/[\r\n]/.test(cmd)) throw new Error('a command cannot contain a line break');
  const write = `printf '%s\\n' ${shellQuote(cmd)} > console`;
  return [enterDir(layout), ...ALIVE, 'alive || { echo "the server is not running" >&2; exit 2; }', `timeout 5 sh -c ${shellQuote(write)}`].join('\n');
};

export { consoleScript };
