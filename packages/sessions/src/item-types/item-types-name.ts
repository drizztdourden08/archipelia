/* @layer core @kind logic */
import { SPOILER } from '../output/read-output.constants';

const ITEM_TYPES_SUFFIX = '_ItemTypes.json';

const itemTypesNameOf = (spoilerName: string) => spoilerName.replace(SPOILER, ITEM_TYPES_SUFFIX);

export { itemTypesNameOf };
