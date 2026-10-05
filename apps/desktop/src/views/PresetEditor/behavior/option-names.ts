/* @layer renderer-app @kind logic */
import type { GameSchema } from '@archipelia/model';
import { NAMES_SHOWN } from '../PresetEditor.constants';

const optionNames = (schema: GameSchema, keys: readonly string[]): string => {
  const names = keys.map((key) => schema.options.find((def) => def.key === key)?.displayName ?? key);
  const more = names.length > NAMES_SHOWN ? ` and ${names.length - NAMES_SHOWN} more` : '';
  return `${names.slice(0, NAMES_SHOWN).join(', ')}${more}`;
};

export { optionNames };
