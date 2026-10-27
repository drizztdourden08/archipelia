/* @layer renderer-app @kind types */
import type { Session } from '@archipelia/model';
import type { LiveTab } from '../../../../live/live.type';
import type { TabPhase } from '../../../../live/tab-phase.type';

type TabRoomProps = { tab: LiveTab; run?: Session; phase: TabPhase };

export type { TabRoomProps };
