/* @layer core @kind logic */
import type { SourceBuildRequest } from '@archipelia/model';
import { isRecord, isStringList } from '@archipelia/model';
import { SHA256 } from '../wheel/wheel.constants';
import { BUILD_TEXT } from './build-text.constants';
import { MAX_TOOLS } from './build.constants';
import { parseBuildId } from './parse-build-id';

const parseBuildRequest = (raw: unknown): SourceBuildRequest => {
  const buildId = parseBuildId(raw);
  const { archiveSha256, tools } = isRecord(raw) ? raw : {};
  if (typeof archiveSha256 !== 'string' || !SHA256.test(archiveSha256.toLowerCase()) || !isStringList(tools) || tools.length > MAX_TOOLS) throw new Error(BUILD_TEXT.invalid);
  return { buildId, archiveSha256, tools };
};

export { parseBuildRequest };
