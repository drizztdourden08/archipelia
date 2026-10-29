/* @layer core @kind logic */
import type { ManifestEntry, ManifestRead } from './manifest-cache.type';
import { stateOfManifest } from './state-of-manifest';

const readOf = (entry: ManifestEntry): ManifestRead => ({ entry, state: stateOfManifest(entry.manifest) });

export { readOf };
