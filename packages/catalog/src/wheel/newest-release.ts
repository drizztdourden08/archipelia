/* @layer core @kind logic */
import type { ReleaseFact } from './wheel.type';
import { releasePool } from './release-pool';

const newestRelease = (releases: readonly ReleaseFact[]): ReleaseFact | undefined => releasePool(releases)[0];

export { newestRelease };
