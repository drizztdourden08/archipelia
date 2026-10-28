/* @layer core @kind logic */
import type { ManifestWant } from './versions.type';

const manifestKey = (repo: string, { release, asset }: ManifestWant): string => `${repo.toLowerCase()}@${release.tag}#${asset.id}`;

export { manifestKey };
