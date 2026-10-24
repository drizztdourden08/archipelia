/* @layer renderer-app @kind types */
import type { SettingAction } from '@drizztdourden08/brock-react';
import type { StatusTone } from '@drizztdourden08/tessera/primitives';

type StatusSectionProps = {
  state: { label: string; tone: StatusTone };
  progress: { percent: number; step: string } | null;
  apVersion: string;
  dir: string;
  openable: boolean;
  failure: string | null;
  actions: readonly SettingAction[];
};

export type { StatusSectionProps };
