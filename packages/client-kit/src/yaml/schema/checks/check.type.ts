/* @layer client-kit @kind types */
import type { KitIssueCode } from '../../../errors/kit-issue.type';
import type { OptionRow } from '../option-schema.type';

type CheckResult = { ok: true; value: unknown } | { ok: false; code: KitIssueCode; message: string };

type OptionCheck = (row: OptionRow, value: unknown) => CheckResult;

export type { CheckResult, OptionCheck };
