/* @layer renderer-app @kind types */
import type { Session } from '@archipelia/model';
import type { SpoilerItemType, SpoilerPlacement } from '@archipelia/sessions/spoiler';

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

type GroupBucket = { label: string; rank: number | string; entries: SpoilerEntry[] };

export type { GroupBucket, GroupBy, SpoilerEntry, SpoilerRecord, SpoilerTab, SpoilerWidgetProps };
