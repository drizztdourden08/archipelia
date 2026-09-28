/* @layer renderer-app @kind logic */
import type { GameSchema } from '@archipelia/model';
import { ALL_TAB } from '../PresetEditor.constants';

const firstTab = (schema: GameSchema) => schema.groups[0] ?? ALL_TAB;

export { firstTab };
