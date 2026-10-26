/* @layer core @kind logic */
import type { ReleaseFact } from './wheel.type';

const releasePool = (releases: readonly ReleaseFact[]): readonly ReleaseFact[] => {
  const stable = releases.filter((release) => !release.prerelease);
  return stable.length > 0 ? stable : releases;
};

export { releasePool };
