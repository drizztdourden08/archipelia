/* @layer core @kind logic */
import type { SourceBuildStart } from '@archipelia/model';
import { isRecord } from '@archipelia/model';
import { parseSourceRef } from '../source/parse-source-ref';
import { BUILD_TEXT } from './build-text.constants';

const parseBuildStart = (raw: unknown): SourceBuildStart => {
  const ref = parseSourceRef(raw);
  if (!isRecord(raw) || raw.confirmed !== true) throw new Error(BUILD_TEXT.confirm);
  return { ...ref, confirmed: true };
};

export { parseBuildStart };
