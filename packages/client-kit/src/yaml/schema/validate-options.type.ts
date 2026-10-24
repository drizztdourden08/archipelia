/* @layer client-kit @kind types */
import type { KitIssue } from '../../errors/kit-issue.type';
import type { OptionSchema } from './option-schema.type';

type ValidateOptionsInput = {
  schema: OptionSchema;
  values: Readonly<Record<string, unknown>>;
  allowUnknown?: boolean;
  allowRoll?: boolean;
  withDefaults?: boolean;
};

type ValidatedOptions =
  | { ok: true; values: Record<string, unknown> }
  | { ok: false; issues: readonly KitIssue[] };

export type { ValidateOptionsInput, ValidatedOptions };
