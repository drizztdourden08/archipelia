/* @layer core @kind logic */
import { isRecord } from '../is-record';
import type { FailureSource, InstallFailure } from './install-failure.type';
import { isInstallFailure } from './is-install-failure';

const installFailureFrom = ({ code, message, data }: FailureSource): InstallFailure | undefined => {
  const candidate = { code, message, packages: isRecord(data) ? data.packages : undefined };
  return isInstallFailure(candidate) ? candidate : undefined;
};

export { installFailureFrom };
