/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { ConsoleWidget, NoSession } from '../views/SessionDashboard';
import { useSessionView } from '../hooks/useSessionView';

const meta: WidgetMeta = {
  label: 'Console',
  order: 5,
  icon: 'send',
  popOut: true,
  defaultVisibility: 'context-only',
  defaultSide: 'bottom',
  defaultDockedSize: 300,
  defaultFloatingSize: { width: 380, height: 300 },
};

const Console = () => {
  const { session, loaded } = useSessionView();
  return session ? <ConsoleWidget session={session} enabled={session.status === 'hosting'} /> : <NoSession loaded={loaded} />;
};

export default Console;
export { meta };
