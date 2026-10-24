/* @layer core @kind logic */
import { TEXT_LIMIT } from './options.constants';

const readText = (name: string, value: unknown): string => {
  if (typeof value !== 'string' || value === '' || value.length > TEXT_LIMIT) throw new Error(`${name} must be text of 1 to ${TEXT_LIMIT} characters`);
  return value;
};

export { readText };
