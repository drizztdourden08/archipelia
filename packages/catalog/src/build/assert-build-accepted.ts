/* @layer core @kind logic */
import type { SourceBuildRequest } from '@archipelia/model';
import { assertPackagesAccepted } from '../install/assert-packages-accepted';
import { staleText } from '../install/stale-text';
import { hashFile } from '../install/hash-file';
import type { ActiveBuild, Archive } from './build.type';
import { BUILD_TEXT } from './build-text.constants';

const assertBuildAccepted = async (build: ActiveBuild, archive: Archive, request: SourceBuildRequest): Promise<void> => {
  const label = `${build.plan.owner}/${build.plan.repo}`;
  if (request.archiveSha256.toLowerCase() !== archive.sha256) throw new Error(staleText(label));
  assertPackagesAccepted(label, { pins: build.pins.map((found) => found.pin), sha256: archive.sha256 }, { sha256: request.archiveSha256, packages: request.tools });
  if (await hashFile(archive.file).catch(() => undefined) !== archive.sha256) throw new Error(BUILD_TEXT.archiveChanged);
};

export { assertBuildAccepted };
