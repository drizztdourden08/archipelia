/* @layer client-kit @kind logic */
import type { ReleaseManifest } from './release.type';

const serializeReleaseManifest = (manifest: ReleaseManifest): string => `${JSON.stringify(manifest, null, 2)}\n`;

export { serializeReleaseManifest };
