/* @layer core @kind logic */
import type { SessionEngine } from '@archipelia/model';
import { check } from './check-keys';
import { ENGINE_KEYS } from './options.constants';
import { readText } from './read-text';

const readEngine = (value: Record<string, unknown> | undefined): SessionEngine | undefined => {
  if (!value) return undefined;
  check('engine', value, ENGINE_KEYS);
  return { id: readText('engine.id', value.id), ap: readText('engine.ap', value.ap), python: readText('engine.python', value.python) };
};

export { readEngine };
