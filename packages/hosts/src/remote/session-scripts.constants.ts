/* @layer core @kind config */

const RUN_FILE = 'run.sh';

const HEREDOC = 'ARCHIPELIA_RUN';

const ALIVE = [
  'PID=$(cat server.pid 2>/dev/null)',
  'alive() { [ -n "$PID" ] && kill -0 "$PID" 2>/dev/null && grep -q MultiServer "/proc/$PID/cmdline" 2>/dev/null; }',
];

export { ALIVE, HEREDOC, RUN_FILE };
