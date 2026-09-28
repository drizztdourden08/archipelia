/* @layer renderer-app @kind types */
import type { Session } from '@archipelia/model';
import type { HostLogLine } from '@archipelia/hosts';
import type { LiveRoom } from '../../SessionDashboard.type';
import type { SessionDockProps } from '../SessionDock/SessionDock.type';

type SessionWidgetsProps = Omit<SessionDockProps, 'content'> & {
  session: Session;
  lines: readonly HostLogLine[];
  live: LiveRoom;
};

export type { SessionWidgetsProps };
