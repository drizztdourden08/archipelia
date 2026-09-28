/* @layer renderer-app @kind types */
import type { OptionDef, OptionValue } from '@archipelia/model';

type OptionRowProps = {
  def: OptionDef;
  value: OptionValue;
  problem?: string;
  onValue: (key: string, value: OptionValue) => void;
  onReset: (key: string) => void;
};

export type { OptionRowProps };
