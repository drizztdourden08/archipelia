/* @layer renderer-app @kind types */
import type { ReactNode } from 'react';

type BuilderHeaderProps = {
  name: string;
  saved: boolean;
  changes: string | null;
  onName: (name: string) => void;
  children?: ReactNode;
};

export type { BuilderHeaderProps };
