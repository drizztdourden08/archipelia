/* @layer core @kind logic */
import { isStringList } from '@archipelia/model';
import { MAX_WHEELS, SHA256 } from './wheel.constants';

const wheelIdsOf = (value: unknown): string[] => {
  if (value === undefined) return [];
  if (!isStringList(value) || value.length > MAX_WHEELS || !value.every((id) => SHA256.test(id))) throw new Error('That package request is not valid.');
  return value;
};

export { wheelIdsOf };
