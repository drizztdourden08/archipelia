/* @layer client-kit @kind logic */
import { createKitError } from '../errors/create-kit-error';
import { BAD_SEGMENT } from './check-entry-path.constants';

const checkEntryPath = (path: string): void => {
  const segments = path.split('/');
  if (path.includes('\\') || path.includes('\0') || segments.some((segment) => BAD_SEGMENT.test(segment))) {
    throw createKitError('invalid-package', `"${path}" is not a safe path inside an apworld.`);
  }
};

export { checkEntryPath };
