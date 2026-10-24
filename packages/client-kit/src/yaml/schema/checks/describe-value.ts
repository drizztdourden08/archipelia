/* @layer client-kit @kind logic */
import { DESCRIBE_LIMIT } from './describe-value.constants';

const spell = (value: unknown): string => {
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number' || typeof value === 'boolean' || value === undefined || value === null) return String(value);
  if (Array.isArray(value)) return 'a list';
  return typeof value === 'object' ? 'an object' : `a ${typeof value}`;
};

const describeValue = (value: unknown): string => {
  const text = spell(value);
  return text.length > DESCRIBE_LIMIT ? `${text.slice(0, DESCRIBE_LIMIT)}...` : text;
};

export { describeValue };
