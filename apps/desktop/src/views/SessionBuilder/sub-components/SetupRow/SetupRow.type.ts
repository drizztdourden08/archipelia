/* @layer renderer-app @kind types */
import type { ReactNode } from 'react';

type SetupRowProps = {
  label: string;
  hint?: ReactNode;
  problem?: string;
  children: ReactNode;
};

export type { SetupRowProps };
