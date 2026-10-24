/* @layer core @kind types */
import type { ApRelease } from '@archipelia/model';

type ReleasesOutcome = { kind: 'ok'; releases: ApRelease[]; etag?: string } | { kind: 'not-modified' };

export type { ReleasesOutcome };
