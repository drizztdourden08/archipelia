/* @layer renderer-app @kind types */
import type { ReactNode } from 'react';

type BuilderHeaderProps = {
  name: string;
  stored: boolean;
  saved: boolean;
  changes: string | null;
  tabOpen: boolean;
  reason?: string;
  reasonId: string;
  actions: ReactNode;
  onName: (name: string) => void;
  children?: ReactNode;
};

export type { BuilderHeaderProps };
