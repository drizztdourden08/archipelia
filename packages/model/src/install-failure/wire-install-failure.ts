/* @layer core @kind logic */
import { encodeInstallFailure } from './encode-install-failure';
import { installFailureOf } from './install-failure-of';

const wireInstallFailure = (error: unknown): unknown => {
  const failure = installFailureOf(error);
  return failure ? new Error(encodeInstallFailure(failure), { cause: error }) : error;
};

export { wireInstallFailure };
