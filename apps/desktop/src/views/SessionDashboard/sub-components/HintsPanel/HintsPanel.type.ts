/* @layer renderer-app @kind types */
import type { HintView } from '@archipelia/sessions/live-room';
import type { LiveConnection } from '../../SessionDashboard.type';

type HintsPanelProps = {
  rows: HintView[];
  connection: LiveConnection;
};

export type { HintsPanelProps };
