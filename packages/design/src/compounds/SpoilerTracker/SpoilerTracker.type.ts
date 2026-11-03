/* @layer renderer-app @kind types */
import type { ReactNode } from 'react';
import type { IconName, SegmentOption, SelectOption, TabItem } from '@drizztdourden08/tessera/primitives';
import type { SpoilerView } from '../SpoilerGroups';

type SpoilerTrackerStat = { key: string; label: string; value: number; icon: IconName; title?: string };

type SpoilerTrackerGroupBy = {
  label: string;
  value: string;
  options: readonly SelectOption[];
  onChange: (value: string) => void;
};

type SpoilerTrackerViewToggle = {
  label: string;
  value: SpoilerView;
  options: SegmentOption<SpoilerView>[];
  onChange: (value: SpoilerView) => void;
};

type SpoilerTrackerControls = { groupBy?: SpoilerTrackerGroupBy; view?: SpoilerTrackerViewToggle };

type SpoilerTrackerProps = {
  stats: readonly SpoilerTrackerStat[];
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  actions?: ReactNode;
  filters?: ReactNode;
  controls?: SpoilerTrackerControls;
  subtotal?: ReactNode;
  children: ReactNode;
};

export type { SpoilerTrackerControls, SpoilerTrackerGroupBy, SpoilerTrackerProps, SpoilerTrackerStat, SpoilerTrackerViewToggle };
