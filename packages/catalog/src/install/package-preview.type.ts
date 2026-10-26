/* @layer core @kind types */
import type { ResolvedPackage } from '@archipelia/engine';
import type { PackageSource } from '@archipelia/model';

type PackagePreview = { sha256: string; packages: ResolvedPackage[]; sources?: PackageSource[] };

export type { PackagePreview };
