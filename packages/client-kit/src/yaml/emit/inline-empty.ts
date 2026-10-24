/* @layer client-kit @kind logic */
import { entriesOf } from './entries-of';
import { isPlainRecord } from './is-plain-record';

const inlineEmpty = (value: unknown): string | null => {
  if (Array.isArray(value) && value.length === 0) return '[]';
  if (isPlainRecord(value) && entriesOf(value).length === 0) return '{}';
  return null;
};

export { inlineEmpty };
