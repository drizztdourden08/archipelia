/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { NoSession, SpoilerWidget } from '../views/SessionDashboard';
import { useSessionView } from '../hooks/useSessionView';

const meta: WidgetMeta = {
  label: 'Spoiler',
  order: 6,
  icon: 'eye-off',
  popOut: true,
  defaultVisibility: 'context-only',
  defaultOpen: false,
  defaultSide: 'right',
  defaultDockedSize: 420,
  defaultFloatingSize: { width: 560, height: 360 },
};

const Spoiler = () => {
  const { session } = useSessionView();
  return session ? <SpoilerWidget session={session} /> : <NoSession />;
};

export default Spoiler;
export { meta };
