/* @layer renderer-app @kind types */
import type { OptionDef, OptionValue } from '@archipelia/model';

type OptionFieldRowProps = {
  def: OptionDef;
  value: OptionValue;
  hint?: string;
  changed: boolean;
  problem?: string;
  onChange: (next: OptionValue) => void;
  onReset: () => void;
};

export type { OptionFieldRowProps };
