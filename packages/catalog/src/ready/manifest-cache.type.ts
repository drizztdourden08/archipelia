/* @layer core @kind types */
import type { ReleaseState } from '../first-party/first-party.type';

type ManifestEntry = { repo: string; fetchedAt: number; etag?: string; manifest: Record<string, unknown> | null };

type ManifestCache = Record<string, ManifestEntry>;

type ManifestRead = { state: ReleaseState; entry?: ManifestEntry };

type ManifestParams = { request: typeof fetch; now: number; force: boolean };

export type { ManifestCache, ManifestEntry, ManifestParams, ManifestRead };
