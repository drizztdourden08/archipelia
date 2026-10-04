/* @layer renderer-app @kind types */
import type { OptionDef, OptionValue } from '@archipelia/model';

type OptionControlProps = {
  def: OptionDef;
  value: OptionValue;
  onChange: (value: OptionValue) => void;
  disabled?: boolean;
  labelId?: string;
};

export type { OptionControlProps };
