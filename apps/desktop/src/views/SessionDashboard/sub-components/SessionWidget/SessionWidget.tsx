/* @layer renderer-app @kind component */
import { EmptyState } from '@drizztdourden08/tessera/primitives';
import { useSessionViewStore } from '../../../../stores/useSessionViewStore';
import type { SessionWidgetProps } from './SessionWidget.type';
import { LOADING_TEXT, NO_SESSION_TEXT } from './SessionWidget.constants';
import { ConsoleWidget } from '../ConsoleWidget';
import { LiveWidget } from '../LiveWidget';
import { LogWidget } from '../LogWidget';
import { SpoilerWidget } from '../SpoilerWidget';
import { useSessionViewListener } from '../../behavior/useSessionViewListener';

const SessionWidget = ({ id }: SessionWidgetProps) => {
  useSessionViewListener();
  const session = useSessionViewStore((state) => state.session);
  const lines = useSessionViewStore((state) => state.lines);
  const loaded = useSessionViewStore((state) => state.loaded);
  if (!session) return <EmptyState message={loaded ? NO_SESSION_TEXT : LOADING_TEXT} />;
  if (id === 'log') return <LogWidget session={session} lines={lines} />;
  if (id === 'console') return <ConsoleWidget session={session} enabled={session.status === 'hosting'} />;
  if (id === 'spoiler') return <SpoilerWidget session={session} />;
  return <LiveWidget id={id} session={session} lines={lines} />;
};

export { SessionWidget };
