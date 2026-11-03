/* @layer renderer-app @kind types */
import type { OptionValue } from '@archipelia/model';
import type { LayoutTab } from '../../behavior/option-layout.type';

type TabBodyProps = {
  tab: LayoutTab;
  readOnly: boolean;
  problems?: ReadonlyMap<string, string>;
  onChange?: (key: string, value: OptionValue) => void;
  onProblem?: (key: string, problem: string | null) => void;
};

export type { TabBodyProps };
