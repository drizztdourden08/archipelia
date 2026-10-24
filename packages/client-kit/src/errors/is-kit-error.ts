/* @layer client-kit @kind logic */
import type { KitError } from './kit-error.type';

const isKitError = (value: unknown): value is KitError =>
  value instanceof Error && value.name === 'KitError' && 'code' in value && 'issues' in value;

export { isKitError };
