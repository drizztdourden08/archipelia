/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import { isText } from './is-text';
import type { RegistryRelease } from './registry.type';

const parseRelease = (value: unknown): RegistryRelease | null => {
  if (!isRecord(value)) return null;
  const { repo, world, manifest, bundle } = value;
  return isText(repo) && isText(world) && isText(manifest) && isText(bundle) ? { repo, world, manifest, bundle } : null;
};

export { parseRelease };
