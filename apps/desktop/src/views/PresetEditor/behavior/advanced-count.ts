/* @layer renderer-app @kind logic */
import type { GameSchema } from '@archipelia/model';
import { isAdvanced } from './is-advanced';

const advancedCount = (schema: GameSchema) => schema.options.filter(isAdvanced).length;

export { advancedCount };
