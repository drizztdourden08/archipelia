/* @layer core @kind types */
import type { CatalogEntry, DataFiles, GameSource, InstalledRelease } from '@archipelia/model';
import type { Registry, RegistryGame } from '@archipelia/trust';
import type { ReleaseState } from '../first-party/first-party.type';

type ReleaseAsset = { id: number; name: string };

type ReleaseSummary = { tag: string; prerelease: boolean; publishedAt: string; assets: ReleaseAsset[] };

type StoredReleases = { fetchedAt: number; etag?: string; releases: ReleaseSummary[] };

type FetchedReleases = { releases: ReleaseSummary[]; etag?: string };

type ReleasesRead = { releases: ReleaseSummary[]; limitedUntil?: number };

type VersionsRequest = { apworld: string; source: GameSource };

type VersionChoice = { id: string; label: string; prerelease: boolean; publishedAt?: string; version?: string; reason?: string };

type VersionList = { by: 'tag' | 'version'; choices: VersionChoice[]; defaultId?: string; latestId?: string; problem?: string };

type VersionsDeps = { files: DataFiles; fetch?: typeof fetch; now?: () => number; readReleases?: (repo: string) => Promise<ReleasesRead> };

type VersionsParams = { entry: CatalogEntry; registry: Registry; ap: string | undefined };

type PinnedParams = VersionsParams & { tag: string };

type Pinned = { entry: CatalogEntry; version: string; release: InstalledRelease };

type RepinParams = VersionsParams & { before: InstalledRelease };

type RepinWays = {
  list: (params: VersionsParams) => Promise<VersionList>;
  pin: (params: PinnedParams) => Promise<Pinned>;
};

type Repin = { pinned?: Pinned; note?: string };

type ManifestAsset = { id: number; name: string; standard: boolean };

type ManifestWant = { release: ReleaseSummary; asset: ManifestAsset };

type ManifestRecord = { manifest: Record<string, unknown> | null };

type ManifestStore = Record<string, ManifestRecord>;

type Checked = { reason?: string; version?: string };

type ManifestReads = Map<string, Record<string, unknown> | null>;

type ReadManifestsParams = { files: DataFiles; request: typeof fetch; repo: string; wants: ManifestWant[] };

type TagEntryParams = { entry: CatalogEntry; game: RegistryGame | undefined; state: ReleaseState; tag: string };

export type {
  Checked, FetchedReleases, ManifestAsset, ManifestReads, ManifestRecord, ManifestStore, ManifestWant, ReadManifestsParams, Repin, RepinParams, RepinWays, Pinned, PinnedParams, ReleaseAsset, ReleasesRead, ReleaseSummary, StoredReleases,
  TagEntryParams, VersionChoice, VersionList, VersionsDeps, VersionsParams, VersionsRequest,
};
