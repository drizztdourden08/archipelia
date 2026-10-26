/* @layer core @kind types */
import type { PackageSource } from '@archipelia/model';

type PackageConsent = { sha256: string; packages: string[]; sources?: PackageSource[] };

export type { PackageConsent };
