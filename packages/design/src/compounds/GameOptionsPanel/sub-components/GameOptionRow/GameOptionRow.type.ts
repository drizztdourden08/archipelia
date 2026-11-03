/* @layer renderer-app @kind types */
import type { OptionValue } from '@archipelia/model';
import type { LayoutRow } from '../../behavior/option-layout.type';

type GameOptionRowProps = {
  row: LayoutRow;
  readOnly: boolean;
  problem?: string;
  onChange?: (key: string, value: OptionValue) => void;
  onProblem?: (key: string, problem: string | null) => void;
};

export type { GameOptionRowProps };
