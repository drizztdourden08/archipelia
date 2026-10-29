/* @layer renderer-app @kind logic */
import type { SessionTemplate } from '@archipelia/model';
import type { IconName } from '@drizztdourden08/tessera/primitives';
import { sessionReach } from '../../../lobbies/session-reach';

const placeIcon = (template: SessionTemplate): IconName => {
  const reach = sessionReach(template);
  if (reach === 'local') return 'monitor';
  return reach === 'lan' ? 'network' : 'globe';
};

export { placeIcon };
