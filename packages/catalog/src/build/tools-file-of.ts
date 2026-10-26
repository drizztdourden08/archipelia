/* @layer core @kind logic */
import type { ResolvedPackage } from '@archipelia/engine';
import { assertPinsHashed } from './assert-pins-hashed';

const toolsFileOf = (pins: ResolvedPackage[]): string => {
  assertPinsHashed(pins);
  return pins.map(({ pin, sha256 }) => `${pin} --hash=sha256:${sha256}`).join('\n');
};

export { toolsFileOf };
