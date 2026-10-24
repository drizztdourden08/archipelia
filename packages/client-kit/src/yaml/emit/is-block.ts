/* @layer client-kit @kind logic */
import { entriesOf } from './entries-of';
import { isPlainRecord } from './is-plain-record';

const isBlock = (value: unknown): boolean =>
  (Array.isArray(value) && value.length > 0) || (isPlainRecord(value) && entriesOf(value).length > 0);

export { isBlock };
