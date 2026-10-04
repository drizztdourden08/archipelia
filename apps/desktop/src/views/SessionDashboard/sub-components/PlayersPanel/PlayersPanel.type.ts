/* @layer renderer-app @kind types */
import type { PlayerView } from '@archipelia/sessions/live-room';
import type { LiveConnection } from '../../SessionDashboard.type';

type PlayersPanelProps = {
  rows: PlayerView[];
  connection: LiveConnection;
};

export type { PlayersPanelProps };
