/* @layer core @kind logic */
import type { LobbySource, RunOverride } from '@archipelia/model';
import { isRecord } from '@archipelia/model';
import { check } from './check-keys';
import { OVERRIDE_KEYS, OVERRIDES_MAX, OVERRIDE_TEXT_LIMIT, SOURCE_KEYS } from './options.constants';
import { readText } from './read-text';

const readNote = (name: string, value: unknown): string => {
  if (typeof value !== 'string' || value.length > OVERRIDE_TEXT_LIMIT) throw new Error(`${name} must be text of at most ${OVERRIDE_TEXT_LIMIT} characters`);
  return value;
};

const readOverride = (value: unknown, index: number): RunOverride => {
  const name = `source.overrides[${index}]`;
  if (!isRecord(value)) throw new Error(`${name} must be an object`);
  check(name, value, OVERRIDE_KEYS);
  return { field: readText(`${name}.field`, value.field), label: readText(`${name}.label`, value.label), from: readNote(`${name}.from`, value.from), to: readNote(`${name}.to`, value.to) };
};

const readOverrides = (value: unknown): RunOverride[] => {
  if (!Array.isArray(value) || value.length > OVERRIDES_MAX) throw new Error(`source.overrides must be a list of at most ${OVERRIDES_MAX} changes`);
  return value.map(readOverride);
};

const readSource = (value: Record<string, unknown> | undefined): LobbySource | undefined => {
  if (!value) return undefined;
  check('source', value, SOURCE_KEYS);
  return { sessionId: readText('source.sessionId', value.sessionId), sessionName: readText('source.sessionName', value.sessionName), overrides: readOverrides(value.overrides) };
};

export { readSource };
