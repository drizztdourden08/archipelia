/* @layer core @kind logic */
import type { RemoteLayout } from './remote-layout.type';
import { shellQuote } from './shell-quote';
import { ALIVE } from './session-scripts.constants';

const stopScript = (layout: RemoteLayout, waitSeconds: number, systemd: boolean) => {
  const force = systemd ? `systemctl --user stop ${layout.unit} 2>/dev/null || kill "$PID"` : 'kill "$PID"';
  return [
    `cd ${shellQuote(layout.dir)} 2>/dev/null || exit 0`,
    ...ALIVE,
    `if alive; then timeout 5 sh -c ${shellQuote("printf '/exit\\n' > console")}; fi`,
    `i=0; while alive && [ "$i" -lt ${waitSeconds * 4} ]; do sleep 0.25; i=$((i+1)); done`,
    `if alive; then ${force}; sleep 2; fi`,
    'rm -f console server.pid host.yaml run.sh',
    'if alive; then exit 1; fi',
  ].join('\n');
};

export { stopScript };
