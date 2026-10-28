/* @layer core @kind types */
import type { CatalogEntry, DataFiles, InstalledRelease } from '@archipelia/model';
import type { TrustDeps } from '../first-party/vet-release.type';
import type { Fetch } from './fetch-file.type';
import type { PackageConsent } from './package-consent.type';

type InstallWorldParams = {
  engineDir: string; files: DataFiles; entry: CatalogEntry; version: string; fetch?: Fetch; trust?: TrustDeps; packages?: PackageConsent; wheels?: string[]; release?: InstalledRelease;
};

export type { InstallWorldParams };
