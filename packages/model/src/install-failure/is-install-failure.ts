/* @layer core @kind logic */
import { isRecord } from '../is-record';
import type { InstallFailure, PackageNeed } from './install-failure.type';
import { GITHUB_PREFIX, INSTALL_FAILURE_CODE } from './install-failure.constants';

const isNeed = (value: unknown): value is PackageNeed =>
  isRecord(value) && typeof value.name === 'string'
  && (value.githubUrl === undefined || (typeof value.githubUrl === 'string' && value.githubUrl.startsWith(GITHUB_PREFIX)));

const isInstallFailure = (value: unknown): value is InstallFailure =>
  isRecord(value) && Object.values<unknown>(INSTALL_FAILURE_CODE).includes(value.code) && typeof value.message === 'string'
  && Array.isArray(value.packages) && value.packages.every(isNeed);

export { isInstallFailure };
