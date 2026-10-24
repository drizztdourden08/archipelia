/* @layer server @kind config */
const SERVER_COMMAND = 'archipelia-server';

const USAGE = [
  `Usage: ${SERVER_COMMAND} [command] [options]`,
  '',
  'Commands:',
  '  start                         run the lobby server (the default)',
  '  token                         print the path of the admin token file',
  '  status                        show the data folder, the health, TLS and the engine',
  '  engine list                   show the installed engines and the Archipelago versions on offer',
  '  engine install <ap> [--python <version>]',
  '                                install an Archipelago version and make it the engine',
  '  engine switch <id>            make an installed engine the active one',
  '  engine remove <id>            delete an installed engine',
  '  health                        exit 0 when the running server is healthy',
  '  help                          show this text',
  '',
  'Options:',
  '  --user-data=<folder>          the data folder (else BROCK_DATA_DIR, STATE_DIRECTORY, ./.user-data)',
  '  --config=<file>               the configuration file (else ARCHIPELIA_CONFIG, <data>/server.toml, /etc/archipelia/server.toml)',
  '',
  'Settings, in the file or the environment: port (ARCHIPELIA_PORT), network (ARCHIPELIA_NETWORK: off, lan,',
  'lan-and-internet), loopback (ARCHIPELIA_LOOPBACK), publicLookup (ARCHIPELIA_PUBLIC_LOOKUP), engine.version',
  '(ARCHIPELIA_ENGINE), engine.python (ARCHIPELIA_PYTHON), engine.auto (ARCHIPELIA_ENGINE_AUTO), tls.key (ARCHIPELIA_TLS_KEY), tls.cert',
  '(ARCHIPELIA_TLS_CERT) and tls.selfSigned (ARCHIPELIA_TLS_SELF_SIGNED).',
];

const SERVE_COMMANDS = ['start', 'health'];
const VALUE_FLAGS = ['python'];

export { SERVE_COMMANDS, USAGE, VALUE_FLAGS };
