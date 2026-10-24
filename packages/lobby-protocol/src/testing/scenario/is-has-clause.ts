/* @layer testing @kind logic */
import type { JsonValue } from './scenario.type';
import { isRecord } from '../../validate/is-record';

const isHasClause = (value: JsonValue): value is { $has: JsonValue } =>
  isRecord(value) && Object.keys(value).length === 1 && '$has' in value;

export { isHasClause };
