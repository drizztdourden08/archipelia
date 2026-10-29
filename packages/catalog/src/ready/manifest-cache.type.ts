/* @layer core @kind types */
import type { ReleaseState } from '../first-party/first-party.type';

type ManifestEntry = { repo: string; fetchedAt: number; etag?: string; tag?: string; checked?: boolean; manifest: Record<string, unknown> | null };

type ManifestCache = Record<string, ManifestEntry>;

type ManifestRead = { state: ReleaseState; entry?: ManifestEntry };

type ManifestParams = { request: typeof fetch; now: number; force: boolean };

type PrereleaseManifest = { manifest: Record<string, unknown>; tag: string };

export type { ManifestCache, ManifestEntry, ManifestParams, ManifestRead, PrereleaseManifest };
