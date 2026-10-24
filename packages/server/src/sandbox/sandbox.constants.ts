/* @layer core @kind config */

const BWRAP_DIRS = ['/usr/bin', '/bin', '/usr/local/bin'];

const BWRAP_NAME = 'bwrap';

const ISOLATION_FLAGS = ['--die-with-parent', '--new-session', '--unshare-all', '--cap-drop', 'ALL'];

const SYSTEM_PATHS = ['/usr', '/bin', '/sbin', '/lib', '/lib32', '/lib64', '/etc/ld.so.cache', '/etc/ld.so.conf', '/etc/ld.so.conf.d', '/etc/localtime'];

const SANDBOX_TMP = '/tmp';

const SANDBOX_ENV = { PATH: '/usr/local/bin:/usr/bin:/bin', HOME: SANDBOX_TMP, TMPDIR: SANDBOX_TMP, LANG: 'C.UTF-8', PYTHONDONTWRITEBYTECODE: '1' };

const PASSED_ENV = ['SKIP_REQUIREMENTS_UPDATE', 'PYTHONUNBUFFERED', 'PYTHONUTF8'];

const PROBE_COMMAND = '/usr/bin/true';

const PROBE_TIMEOUT_MS = 10000;

export { BWRAP_DIRS, BWRAP_NAME, ISOLATION_FLAGS, PASSED_ENV, PROBE_COMMAND, PROBE_TIMEOUT_MS, SANDBOX_ENV, SANDBOX_TMP, SYSTEM_PATHS };
