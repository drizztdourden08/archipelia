/* @layer core @kind logic */
import type { InstallFailure } from './install-failure.type';
import { INSTALL_FAILURE_TAG } from './install-failure.constants';

const encodeInstallFailure = (failure: InstallFailure): string => `${INSTALL_FAILURE_TAG}${JSON.stringify(failure)}`;

export { encodeInstallFailure };
