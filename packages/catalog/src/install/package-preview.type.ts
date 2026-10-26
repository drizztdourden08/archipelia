/* @layer core @kind types */
import type { ResolvedPackage } from '@archipelia/engine';

type PackagePreview = { sha256: string; packages: ResolvedPackage[] };

export type { PackagePreview };
