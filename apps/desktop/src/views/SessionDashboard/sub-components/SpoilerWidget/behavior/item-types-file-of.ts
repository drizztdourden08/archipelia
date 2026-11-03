/* @layer renderer-app @kind logic */
import { ITEM_TYPES_SUFFIX, SPOILER_SUFFIX } from '../SpoilerWidget.constants';

const itemTypesFileOf = (file: string | null): string | null =>
  (file?.endsWith(SPOILER_SUFFIX) ? `${file.slice(0, -SPOILER_SUFFIX.length)}${ITEM_TYPES_SUFFIX}` : null);

export { itemTypesFileOf };
