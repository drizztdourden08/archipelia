/* @layer core @kind logic */
import type { InstallFailure } from './install-failure.type';
import { INSTALL_FAILURE_TAG } from './install-failure.constants';
import { isInstallFailure } from './is-install-failure';

const decodeInstallFailure = (wire: string): InstallFailure | undefined => {
  const at = wire.indexOf(INSTALL_FAILURE_TAG);
  if (at < 0) return undefined;
  try {
    const value: unknown = JSON.parse(wire.slice(at + INSTALL_FAILURE_TAG.length));
    return isInstallFailure(value) ? value : undefined;
  } catch {
    return undefined;
  }
};

export { decodeInstallFailure };
