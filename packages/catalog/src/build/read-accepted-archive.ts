/* @layer core @kind logic */
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import type { SourceBuildRequest } from '@archipelia/model';
import { assertPackagesAccepted } from '../install/assert-packages-accepted';
import { staleText } from '../install/stale-text';
import type { ActiveBuild, Archive } from './build.type';
import { BUILD_TEXT } from './build-text.constants';

const readAcceptedArchive = async (build: ActiveBuild, archive: Archive, request: SourceBuildRequest): Promise<Uint8Array> => {
  const label = `${build.plan.owner}/${build.plan.repo}`;
  if (request.archiveSha256.toLowerCase() !== archive.sha256) throw new Error(staleText(label));
  assertPackagesAccepted(label, { pins: build.pins.map((found) => found.pin), sha256: archive.sha256 }, { sha256: request.archiveSha256, packages: request.tools });
  const bytes = new Uint8Array(await readFile(archive.file).catch(() => Buffer.alloc(0)));
  if (createHash('sha256').update(bytes).digest('hex') !== archive.sha256) throw new Error(BUILD_TEXT.archiveChanged);
  return bytes;
};

export { readAcceptedArchive };
