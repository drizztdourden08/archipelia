/* @layer client-kit @kind types */
import type { KitIssue } from './kit-issue.type';

type KitErrorCode =
  | 'usage'
  | 'invalid-version'
  | 'invalid-manifest'
  | 'invalid-schema'
  | 'invalid-input'
  | 'invalid-package'
  | 'invalid-apworld'
  | 'invalid-index'
  | 'invalid-config'
  | 'unsupported-value';

type KitError = Error & { code: KitErrorCode; issues: readonly KitIssue[] };

export type { KitError, KitErrorCode };
