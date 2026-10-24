/* @layer client-kit @kind types */

type KitIssueCode =
  | 'unknown-option'
  | 'wrong-type'
  | 'bad-choice'
  | 'out-of-range'
  | 'bad-slot-name'
  | 'bad-game'
  | 'duplicate-value'
  | 'bad-value';

type KitIssue = { key: string; code: KitIssueCode; message: string };

export type { KitIssue, KitIssueCode };
