/* @layer client-kit @kind logic */
import type { Failer } from './create-failer.type';
import type { KitErrorCode } from './kit-error.type';
import { createKitError } from './create-kit-error';

const createFailer = (code: KitErrorCode, prefix: string): Failer => (message) => {
  throw createKitError(code, `${prefix}${message}`);
};

export { createFailer };
