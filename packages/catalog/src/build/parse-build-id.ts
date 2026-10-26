/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import { BUILD_ID } from './build.constants';
import { BUILD_TEXT } from './build-text.constants';

const parseBuildId = (raw: unknown): string => {
  const id = isRecord(raw) ? raw.buildId : undefined;
  if (typeof id !== 'string' || !BUILD_ID.test(id)) throw new Error(BUILD_TEXT.invalid);
  return id;
};

export { parseBuildId };
