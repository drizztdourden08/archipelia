/* @layer renderer-app @kind logic */
import type { EngineInstallResult } from '@archipelia/model';
import { FAILED_CHECK } from '../EngineSettings.constants';

const installFailure = (result: EngineInstallResult): string => {
  const check = result.failed ? ` ${FAILED_CHECK[result.failed]}` : '';
  return `The new engine was not installed.${check} The engine in use is untouched.`;
};

export { installFailure };
