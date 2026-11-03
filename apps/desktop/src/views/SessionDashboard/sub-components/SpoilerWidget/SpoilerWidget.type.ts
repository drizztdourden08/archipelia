/* @layer renderer-app @kind types */
import type { Session } from '@archipelia/model';
import type { SpoilerItemType, SpoilerLog, SpoilerPlacement } from '@archipelia/sessions/spoiler';
import type { useSpoilerState } from './behavior/useSpoilerState';

type SpoilerWidgetProps = { session: Session };

type GroupBy = 'finder' | 'receiver' | 'game' | 'sphere' | 'type' | 'none';

type SpoilerTab = 'placements' | 'playthrough' | 'entrances' | 'paths' | 'settings' | 'raw';

type SpoilerRecord = Record<string, string>;

type SpoilerEntry = {
  placement: SpoilerPlacement;
  type: SpoilerItemType;
  finderGame: string;
  receiverGame: string;
  area: string | null;
  record: SpoilerRecord;
  text: string;
};

type GroupTag = { label: string; rank: number | string };

type GroupBucket = GroupTag & { entries: SpoilerEntry[] };

type RootSource = { log: SpoilerLog; entries: readonly SpoilerEntry[]; shown: readonly SpoilerEntry[]; by: GroupBy };

type SpoilerState = ReturnType<typeof useSpoilerState>;

export type { GroupBucket, GroupBy, GroupTag, RootSource, SpoilerEntry, SpoilerState, SpoilerTab, SpoilerWidgetProps };
