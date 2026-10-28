/* @layer core @kind logic */
import { APWORLD_SUFFIX, BUILD_VERSION } from './versions.constants';
import type { ReleaseSummary } from './versions.type';

const buildVersionsOf = (module: string, { assets }: ReleaseSummary): string[] => {
  const prefix = `${module}-ap`;
  return assets
    .filter((asset) => asset.name.startsWith(prefix) && asset.name.endsWith(APWORLD_SUFFIX))
    .map((asset) => asset.name.slice(prefix.length, asset.name.length - APWORLD_SUFFIX.length))
    .filter((version) => BUILD_VERSION.test(version));
};

export { buildVersionsOf };
