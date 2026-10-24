/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import { isText } from './is-text';
import { RELEASE_KIND_BUILDS } from './parse-release.constants';
import type { RegistryRelease } from './registry.type';

const parseRelease = (value: unknown): RegistryRelease | null => {
  if (!isRecord(value)) return null;
  const { repo, world, manifest, bundle, kind } = value;
  if (!isText(repo) || !isText(world) || !isText(manifest) || !isText(bundle)) return null;
  if (kind === undefined) return { repo, world, manifest, bundle };
  return kind === RELEASE_KIND_BUILDS ? { repo, world, manifest, bundle, kind } : null;
};

export { parseRelease };
