/* @layer renderer-app @kind types */
import type { ReactNode } from 'react';
import type { GameSchema, OptionValue } from '@archipelia/model';

type GameOptionsPanelProps = {
  schema: GameSchema;
  values: Readonly<Record<string, OptionValue>>;
  onChange?: (key: string, value: OptionValue) => void;
  readOnly?: boolean;
  title?: string;
  problems?: ReadonlyMap<string, string>;
  onProblem?: (key: string, problem: string | null) => void;
  focusKey?: string | null;
  onFocused?: () => void;
  toolbar?: ReactNode;
  className?: string;
};

export type { GameOptionsPanelProps };
