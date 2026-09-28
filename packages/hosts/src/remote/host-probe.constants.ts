/* @layer core @kind config */

const PORT_CHECK = [
  'import socket, sys',
  's = socket.socket()',
  's.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)',
  'try:',
  '    s.bind(("0.0.0.0", int(sys.argv[1])))',
  '    print("free")',
  'except OSError:',
  '    print("busy")',
].join('\n');

const VERSION_CHECK = 'import sys; print("%d.%d.%d" % sys.version_info[:3])';

export { PORT_CHECK, VERSION_CHECK };
