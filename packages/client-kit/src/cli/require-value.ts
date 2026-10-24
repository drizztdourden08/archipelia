/* @layer client-kit @kind logic */
import { createKitError } from '../errors/create-kit-error';

const requireValue = (value: string | undefined, flag: string): string => {
  if (value === undefined || value === '') throw createKitError('usage', `Missing ${flag}.`);
  return value;
};

export { requireValue };
