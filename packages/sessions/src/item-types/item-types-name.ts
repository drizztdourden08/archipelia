/* @layer core @kind logic */
import { SPOILER } from '../output/read-output.constants';
import { ITEM_TYPES_SUFFIX } from './item-types.constants';

const itemTypesNameOf = (spoilerName: string) => spoilerName.replace(SPOILER, ITEM_TYPES_SUFFIX);

export { itemTypesNameOf };
