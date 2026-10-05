/* @layer renderer-app @kind types */
import type { OptionDef, OptionValue } from '@archipelia/model';

type OptionControlProps = {
  def: OptionDef;
  value: OptionValue;
  onChange: (value: OptionValue) => void;
  onProblem?: (problem: string | null) => void;
  disabled?: boolean;
};

export type { OptionControlProps };
