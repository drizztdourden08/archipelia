/* @layer electron-main @kind logic */
import { APWORLD_LIMITS, unzipCapped } from '@archipelia/model/zip';
import { isRecord } from '@archipelia/model';
import { FALLBACK_WORLD_VERSION, MANIFEST_NAME, SEMVER } from './joins.constants';

const parseJson = (bytes: Uint8Array | undefined): unknown => {
  if (!bytes) return undefined;
  try {
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return undefined;
  }
};

const worldVersionOf = (bytes: Uint8Array, module: string, schemaVersion: string): string => {
  const name = `${module}/${MANIFEST_NAME}`;
  const manifest = parseJson(unzipCapped(bytes, APWORLD_LIMITS, (entry) => entry.name === name).files[name]);
  const written = isRecord(manifest) && typeof manifest.world_version === 'string' ? manifest.world_version : schemaVersion;
  return SEMVER.test(written) ? written : FALLBACK_WORLD_VERSION;
};

export { worldVersionOf };
