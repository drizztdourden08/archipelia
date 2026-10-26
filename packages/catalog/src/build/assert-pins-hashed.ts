/* @layer core @kind logic */
import type { ResolvedPackage } from '@archipelia/engine';

const assertPinsHashed = (pins: ResolvedPackage[]): void => {
  const bare = pins.find((found) => found.sha256 === undefined);
  if (bare) throw new Error(`pip gave no checksum for the build tool ${bare.name}, so Archipelia will not install it.`);
};

export { assertPinsHashed };
