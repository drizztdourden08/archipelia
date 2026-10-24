/* @layer client-kit @kind logic */
import type { KitError, KitErrorCode } from './kit-error.type';
import type { KitIssue } from './kit-issue.type';

const createKitError = (code: KitErrorCode, message: string, issues: readonly KitIssue[] = []): KitError =>
  Object.assign(new Error(message), { name: 'KitError', code, issues });

export { createKitError };
