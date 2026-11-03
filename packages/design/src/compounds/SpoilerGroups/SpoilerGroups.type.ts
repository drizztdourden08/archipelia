/* @layer renderer-app @kind types */
type SpoilerTone = 'key' | 'useful' | 'trap' | 'filler' | 'unknown';

type SpoilerMark = { tone: SpoilerTone; label: string };

type SpoilerRowData = {
  id: string;
  primary: string;
  secondary?: string;
  mark?: SpoilerMark;
  receiver?: string;
  sphere?: number | null;
  detail?: string;
};

type SpoilerCountKey = 'total' | 'required' | 'others';

type SpoilerCount = { key: SpoilerCountKey; value: number; label: string };

type SpoilerGroup = {
  key: string;
  label: string;
  counts: readonly SpoilerCount[];
  rows: readonly SpoilerRowData[];
  children: readonly SpoilerGroup[];
};

type SpoilerView = 'compact' | 'detailed';

type SpoilerGroupsProps = {
  root: SpoilerGroup;
  view: SpoilerView;
  expanded: readonly string[];
  onExpandedChange: (keys: readonly string[]) => void;
  label: string;
  emptyLabel: string;
};

type SpoilerBatch = { key: string; rows: readonly SpoilerRowData[] };

export type {
  SpoilerBatch, SpoilerCount, SpoilerCountKey, SpoilerGroup, SpoilerGroupsProps, SpoilerMark, SpoilerRowData, SpoilerTone, SpoilerView,
};
