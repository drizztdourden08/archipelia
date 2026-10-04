/* @layer renderer-app @kind types */
import type { ReactNode } from 'react';
import type { LogRow } from '@drizztdourden08/tessera/composites';
import type { TabItem } from '@drizztdourden08/tessera/primitives';

type LogLinesProps = {
  rows: LogRow[];
  search: string;
  onSearchChange: (query: string) => void;
  emptyLabel: string;
  countLabel?: string;
  tabs?: TabItem[];
  activeTab?: string;
  onTabChange?: (id: string) => void;
  copyText?: (shown: readonly LogRow[]) => string;
  toolbarExtra?: ReactNode;
  placeholder?: ReactNode;
};

export type { LogLinesProps };
