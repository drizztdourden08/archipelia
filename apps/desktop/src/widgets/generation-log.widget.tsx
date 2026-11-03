/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { GenerationLogWidget, NoSession } from '../views/SessionDashboard';
import { useSessionView } from '../hooks/useSessionView';

const meta: WidgetMeta = {
  label: 'Generation logs',
  order: 6,
  icon: 'file-text',
  popOut: true,
  padding: 'none',
  fill: true,
  context: 'session',
  defaultVisibility: 'context-only',
  defaultOpen: true,
  defaultSide: 'bottom',
  defaultDockedSize: 300,
  defaultFloatingSize: { width: 640, height: 320 },
};

const GenerationLog = () => {
  const { session } = useSessionView();
  return session ? <GenerationLogWidget session={session} /> : <NoSession />;
};

export default GenerationLog;
export { meta };
