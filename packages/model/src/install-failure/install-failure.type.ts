/* @layer core @kind types */
import type { INSTALL_FAILURE_CODE } from './install-failure.constants';

type PackageNeed = { name: string; githubUrl?: string };

type InstallFailure = {
  code: (typeof INSTALL_FAILURE_CODE)[keyof typeof INSTALL_FAILURE_CODE];
  message: string;
  packages: PackageNeed[];
};

export type { InstallFailure, PackageNeed };
