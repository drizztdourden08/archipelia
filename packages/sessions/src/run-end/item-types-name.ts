/* @layer core @kind logic */
import type { SessionOutput } from '@archipelia/model';
import { ITEM_TYPES_SUFFIX, SPOILER_SUFFIX, ZIP_SUFFIX } from './run-end.constants';

const itemTypesName = (output: SessionOutput | undefined): string | undefined => {
  if (!output) return undefined;
  if (output.spoiler) return output.spoiler.replace(SPOILER_SUFFIX, ITEM_TYPES_SUFFIX);
  return output.zip.replace(ZIP_SUFFIX, ITEM_TYPES_SUFFIX);
};

export { itemTypesName };
