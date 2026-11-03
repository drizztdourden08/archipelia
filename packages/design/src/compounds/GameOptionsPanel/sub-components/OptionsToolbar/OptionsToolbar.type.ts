/* @layer renderer-app @kind types */
import type { ReactNode } from 'react';

type OptionsToolbarProps = {
  query: string;
  onQueryChange: (query: string) => void;
  onResetAll?: () => void;
  extra?: ReactNode;
};

export type { OptionsToolbarProps };
