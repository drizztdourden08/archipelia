/* @layer client-kit @kind logic */
import type { KitErrorCode } from './kit-error.type';
import { createKitError } from './create-kit-error';

const createFailer = (code: KitErrorCode, prefix: string) => (message: string): never => {
  throw createKitError(code, `${prefix}${message}`);
};

export { createFailer };
