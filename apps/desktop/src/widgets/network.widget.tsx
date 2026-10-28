/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { NetworkWidget } from '../views/ArchipeliaServers';
import { useSessionView } from '../hooks/useSessionView';

const meta: WidgetMeta = {
  label: 'Network',
  order: 1,
  icon: 'network',
  popOut: true,
  context: 'session',
  defaultVisibility: 'always',
  defaultOpen: true,
  defaultSide: 'left',
  defaultDockedSize: 320,
  defaultFloatingSize: { width: 380, height: 420 },
};

const Network = () => {
  const { network } = useSessionView();
  return <NetworkWidget network={network} />;
};

export default Network;
export { meta };
