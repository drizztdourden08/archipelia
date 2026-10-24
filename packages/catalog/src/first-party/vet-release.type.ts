/* @layer core @kind types */
import type { CatalogEntry } from '@archipelia/model';
import type { RegistryClient, TrustedRootLoad } from '@archipelia/trust';

type TrustDeps = { clients: RegistryClient[]; root: () => Promise<TrustedRootLoad['root']> };

type VetReleaseParams = { entry: CatalogEntry; bytes: Uint8Array; bundleUrl?: string; trust?: TrustDeps; fetch: typeof fetch };

export type { TrustDeps, VetReleaseParams };
