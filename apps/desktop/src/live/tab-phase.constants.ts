/* @layer renderer-app @kind config */
import type { DocumentTabStatus } from '@drizztdourden08/tessera/composites';
import type { TabPhase } from './tab-phase.type';

const TAB_STATUS: Record<TabPhase, DocumentTabStatus> = {
  lobby: { label: 'Lobby', tone: 'info' },
  generating: { label: 'Generating', tone: 'info', pulse: true },
  hosting: { label: 'Hosting', tone: 'success' },
  stopped: { label: 'Stopped', tone: 'neutral' },
  failed: { label: 'Failed', tone: 'danger' },
};

const ROOM_PHASES: readonly TabPhase[] = ['generating', 'hosting', 'stopped'];

export { ROOM_PHASES, TAB_STATUS };
