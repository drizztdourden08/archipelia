/* @layer core @kind logic */
import type { InstallFailure } from './install-failure.type';
import { CAUSE_DEPTH } from './install-failure.constants';
import { isInstallFailure } from './is-install-failure';

const installFailureOf = (error: unknown): InstallFailure | undefined => {
  let current = error;
  for (let level = 0; level < CAUSE_DEPTH && current instanceof Error; level += 1) {
    if (isInstallFailure(current)) return { code: current.code, message: current.message, packages: current.packages };
    current = current.cause;
  }
  return undefined;
};

export { installFailureOf };
