/* @layer client-kit @kind logic */
import { createKitError } from '../../errors/create-kit-error';
import { formatString } from './format-string';

const formatNumber = (value: number): string => {
  const text = String(value);
  if (!Number.isFinite(value) || text.includes('e')) {
    throw createKitError('unsupported-value', `The number ${text} cannot be written as plain YAML.`);
  }
  return text;
};

const formatScalar = (value: unknown): string => {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return formatNumber(value);
  if (typeof value === 'string') return formatString(value);
  throw createKitError('unsupported-value', `A ${typeof value} value cannot be written as YAML.`);
};

export { formatScalar };
