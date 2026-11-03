/* @layer renderer-app @kind types */
import type { Session, SessionTemplate } from '@archipelia/model';
import type { LiveTab } from '../../../../live/live.type';
import type { TabPhase } from '../../../../live/tab-phase.type';

type RoomStageProps = { tab: LiveTab; saved: SessionTemplate; run?: Session; phase: TabPhase };

export type { RoomStageProps };
