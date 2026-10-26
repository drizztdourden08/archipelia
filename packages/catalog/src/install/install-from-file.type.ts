/* @layer core @kind types */
import type { DataFiles } from '@archipelia/model';
import type { PackageConsent } from './package-consent.type';

type InstallFromFileParams = { engineDir: string; files: DataFiles; path: string; packages?: PackageConsent };

export type { InstallFromFileParams };
