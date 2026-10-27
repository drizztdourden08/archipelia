/* @layer client-kit @kind logic */
import { readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { ReleaseExtras } from './release-extras.type';
import type { ReleaseFilesOptions, ReleaseFilesResult } from './node.type';
import { createIssuesError } from '../errors/create-issues-error';
import { parseApworldIndex } from '../index-manifest/parse-apworld-index';
import { buildReleaseManifest } from '../release-manifest/build-release-manifest';
import { DESCRIPTION_NAME, MANIFEST_NAME, THUMBNAIL_BASE_NAME } from '../release-manifest/release.constants';
import { serializeReleaseManifest } from '../release-manifest/serialize-release-manifest';
import { findIndexFile } from './find-index-file';
import { readReleaseExtras } from './read-release-extras';

const writeThumbnail = async (dir: string, { bytes, format }: NonNullable<ReleaseExtras['thumbnail']>): Promise<string> => {
  await rm(join(dir, `${THUMBNAIL_BASE_NAME}.${format === 'png' ? 'webp' : 'png'}`), { force: true });
  const path = join(dir, `${THUMBNAIL_BASE_NAME}.${format}`);
  await writeFile(path, bytes);
  return path;
};

const writeDescription = async (dir: string, bytes: Uint8Array): Promise<string> => {
  const path = join(dir, DESCRIPTION_NAME);
  await writeFile(path, bytes);
  return path;
};

const writeReleaseFiles = async (options: ReleaseFilesOptions): Promise<ReleaseFilesResult> => {
  const { dir, module, direct, kit, thumbnail, description } = options;
  const index = parseApworldIndex(await readFile(await findIndexFile(dir, module), 'utf8'));
  const manifest = buildReleaseManifest({ ...index, direct, kit });
  const extras = await readReleaseExtras(thumbnail, description);
  if (extras.issues.length > 0) throw createIssuesError('invalid-release-file', 'The release files are not valid:', extras.issues);
  const manifestPath = join(dir, MANIFEST_NAME);
  await writeFile(manifestPath, serializeReleaseManifest(manifest));
  return {
    manifest,
    manifestPath,
    thumbnailPath: extras.thumbnail === undefined ? undefined : await writeThumbnail(dir, extras.thumbnail),
    descriptionPath: extras.description === undefined ? undefined : await writeDescription(dir, extras.description),
    warnings: extras.warnings,
  };
};

export { writeReleaseFiles };
