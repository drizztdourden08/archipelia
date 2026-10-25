/* @layer renderer-app @kind types */
import type { OptionDef, OptionValue } from '@archipelia/model';

type OptionFieldRowProps = {
  id?: string;
  def: OptionDef;
  value: OptionValue;
  hint?: string;
  changed: boolean;
  problem?: string;
  onChange: (next: OptionValue) => void;
  onReset: () => void;
  onProblem?: (problem: string | null) => void;
};

export type { OptionFieldRowProps };
