/* @layer core @kind config */
import type { BwrapFeatures } from './sandbox.type';

const TOOL_DIRS = ['/usr/bin', '/bin', '/usr/local/bin'];

const BWRAP_NAME = 'bwrap';

const PRLIMIT_NAME = 'prlimit';

const BASIC_FEATURES: BwrapFeatures = { tmpfsSize: false, disableUserns: false };

const ISOLATION_FLAGS = ['--die-with-parent', '--new-session', '--unshare-all', '--cap-drop', 'ALL'];

const NO_USERNS_FLAGS = ['--unshare-user', '--disable-userns'];

const SYSTEM_PATHS = ['/usr', '/bin', '/sbin', '/lib', '/lib32', '/lib64', '/etc/ld.so.cache', '/etc/ld.so.conf', '/etc/ld.so.conf.d', '/etc/localtime'];

const SHARE_NET_FLAG = '--share-net';

const NETWORK_PATHS = ['/etc/resolv.conf', '/etc/hosts', '/etc/nsswitch.conf', '/etc/ssl', '/etc/ca-certificates', '/etc/pki'];

const SANDBOX_TMP = '/tmp';

const GIB = 1024 * 1024 * 1024;

const TMP_BYTES = String(GIB / 4);

const RUN_LIMITS = ['--cpu=3600', `--as=${16 * GIB}`, `--fsize=${GIB}`];

const LOADAVG_FILE = '/proc/loadavg';

const NPROC_MARGIN = 2048;

const SANDBOX_ENV = { PATH: '/usr/local/bin:/usr/bin:/bin', HOME: SANDBOX_TMP, TMPDIR: SANDBOX_TMP, LANG: 'C.UTF-8', PYTHONDONTWRITEBYTECODE: '1' };

const PASSED_ENV = [
  'SKIP_REQUIREMENTS_UPDATE', 'PYTHONUNBUFFERED', 'PYTHONUTF8', 'PYTHONNOUSERSITE', 'PIP_NO_INPUT', 'PIP_DISABLE_PIP_VERSION_CHECK', 'CC', 'CXX', 'CFLAGS', 'CXXFLAGS',
  'CPPFLAGS', 'LDFLAGS',
];

const PROBE_COMMAND = '/usr/bin/true';

const PROBE_TIMEOUT_MS = 10000;

export {
  BASIC_FEATURES, BWRAP_NAME, ISOLATION_FLAGS, LOADAVG_FILE, NETWORK_PATHS, NO_USERNS_FLAGS, NPROC_MARGIN, PASSED_ENV, PRLIMIT_NAME, PROBE_COMMAND, PROBE_TIMEOUT_MS, RUN_LIMITS, SANDBOX_ENV,
  SANDBOX_TMP, SHARE_NET_FLAG, SYSTEM_PATHS, TMP_BYTES, TOOL_DIRS,
};
