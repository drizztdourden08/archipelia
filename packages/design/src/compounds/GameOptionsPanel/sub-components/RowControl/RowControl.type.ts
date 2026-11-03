/* @layer renderer-app @kind types */
import type { OptionValue } from '@archipelia/model';
import type { LayoutRow } from '../../behavior/option-layout.type';

type RowControlProps = {
  row: LayoutRow;
  id: string;
  readOnly: boolean;
  problem?: string;
  onChange: (value: OptionValue) => void;
  onProblem: (problem: string | null) => void;
};

export type { RowControlProps };
