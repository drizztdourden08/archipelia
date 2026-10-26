/* @layer core @kind config */

const INSTALL_FAILURE_CODE = { packageUnavailable: 'package-unavailable' } as const;

const CAUSE_DEPTH = 4;

const GITHUB_PREFIX = 'https://github.com/';

export { CAUSE_DEPTH, GITHUB_PREFIX, INSTALL_FAILURE_CODE };
