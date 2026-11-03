/* @layer renderer-app @kind logic */
import type { GameSchema, OptionDef } from '@archipelia/model';
import { FALLBACK_TAB } from '../GameOptionsPanel.constants';

const tabIdOf = (schema: GameSchema, def: OptionDef) => (schema.groups.length === 0 ? FALLBACK_TAB : def.group);

export { tabIdOf };
