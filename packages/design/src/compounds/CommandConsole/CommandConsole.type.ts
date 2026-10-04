/* @layer renderer-app @kind types */
import type { ReactNode } from 'react';
import type { LogRow } from '@drizztdourden08/tessera/composites';

type CommandConsoleProps = {
  rows: readonly LogRow[];
  onSubmit: (command: string) => boolean | void;
  history: readonly string[];
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  actions?: ReactNode;
  label?: string;
  placeholder?: string;
  emptyLabel?: string;
  limit?: number;
};

export type { CommandConsoleProps };
