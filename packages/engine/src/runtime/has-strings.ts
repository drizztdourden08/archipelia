/* @layer core @kind logic */
import { isRecord } from './is-record';

const hasStrings = (value: unknown, keys: string[]): value is Record<string, string> =>
  isRecord(value) && keys.every((key) => typeof value[key] === 'string');

export { hasStrings };
