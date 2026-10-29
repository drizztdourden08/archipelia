/* @layer renderer-app @kind types */
import type { ReactNode } from 'react';

type LobbySeatGridProps = {
  label: string;
  addLabel: string;
  addDisabled?: boolean;
  onAdd: () => void;
  children: ReactNode;
};

export type { LobbySeatGridProps };
