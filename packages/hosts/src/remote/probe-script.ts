/* @layer core @kind logic */
import { shellQuote } from './shell-quote';
import { PORT_CHECK, VERSION_CHECK } from './host-probe.constants';

const probeScript = (apPath: string, gamePort: number) => [
  `AP=${shellQuote(apPath)}`,
  'case "$AP" in "~") AP="$HOME";; "~/"*) AP="$HOME/$(printf %s "$AP" | cut -c3-)";; esac',
  'echo "ap=$AP"',
  'if [ -x "$AP/.venv/bin/python" ]; then PY="$AP/.venv/bin/python"; else PY=$(command -v python3 2>/dev/null); fi',
  'echo "python=$PY"',
  `[ -n "$PY" ] && echo "pyver=$("$PY" -c ${shellQuote(VERSION_CHECK)} 2>/dev/null)"`,
  'if [ -f "$AP/MultiServer.py" ]; then echo multiserver=yes; else echo multiserver=no; fi',
  `echo "apver=$(sed -n ${shellQuote('s/^__version__ = "\\([^"]*\\)".*/\\1/p')} "$AP/Utils.py" 2>/dev/null | head -n 1)"`,
  'if command -v systemd-run >/dev/null 2>&1 && systemctl --user show-environment >/dev/null 2>&1; then echo systemd=yes; else echo systemd=no; fi',
  'echo "linger=$(loginctl show-user "$(id -un)" -p Linger 2>/dev/null | sed "s/^Linger=//")"',
  `[ -n "$PY" ] && echo "port=$("$PY" -c ${shellQuote(PORT_CHECK)} ${gamePort} 2>/dev/null)"`,
  'exit 0',
].join('\n');

export { probeScript };
