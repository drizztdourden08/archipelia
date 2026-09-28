/* @layer renderer-app @kind types */
import type { ReactNode } from 'react';

type OptionFieldProps = {
  label: string;
  description: string;
  hint?: string;
  changed: boolean;
  advanced?: boolean;
  problem?: string;
  onReset: () => void;
  children: ReactNode;
};

type DescriptionPreview = { preview: string; long: boolean };

export type { DescriptionPreview, OptionFieldProps };
