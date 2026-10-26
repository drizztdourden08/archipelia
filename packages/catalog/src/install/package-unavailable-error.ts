/* @layer core @kind logic */
import { INSTALL_FAILURE_CODE } from '@archipelia/model';
import type { PackageNeed } from '@archipelia/model';

class PackageUnavailableError extends Error {
  override readonly name = 'PackageUnavailableError';
  readonly code = INSTALL_FAILURE_CODE.packageUnavailable;
  readonly packages: PackageNeed[];

  constructor(message: string, packages: PackageNeed[], options?: ErrorOptions) {
    super(message, options);
    this.packages = packages;
  }
}

export { PackageUnavailableError };
