/* @layer renderer-app @kind types */
import type { OptionDef, OptionValue } from '@archipelia/model';

type OverrideRowProps = {
  def: OptionDef;
  value: OptionValue;
  presetValue: OptionValue;
  overridden: boolean;
  problem?: string;
  onValue: (key: string, value: OptionValue, presetValue: OptionValue) => void;
  onReset: (key: string) => void;
};

export type { OverrideRowProps };
