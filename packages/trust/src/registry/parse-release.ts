/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import { isText } from './is-text';
import { releaseExtras } from './release-extras';
import type { RegistryRelease } from './registry.type';

const parseRelease = (value: unknown): RegistryRelease | null => {
  if (!isRecord(value)) return null;
  const { repo, repoId, world, manifest, bundle, kind } = value;
  if (!isText(repo) || !isText(world) || !isText(manifest) || !isText(bundle)) return null;
  const extras = releaseExtras(repoId, kind);
  return extras && { repo, world, manifest, bundle, ...extras };
};

export { parseRelease };
