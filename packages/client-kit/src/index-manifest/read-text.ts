/* @layer client-kit @kind logic */
import type { Failer } from '../errors/create-failer.type';

const readText = (fail: Failer, record: Record<string, unknown>, key: string): string => {
  const value = record[key];
  return typeof value === 'string' ? value : fail(`${key} must be a text.`);
};

export { readText };
