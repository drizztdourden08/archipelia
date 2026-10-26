/* @layer renderer-app @kind logic */
import type { SessionTemplate } from '@archipelia/model';
import { sessionReach } from '../../../lobbies/session-reach';
import type { SessionPlace } from '../SessionBuilder.type';

const placeOf = (template: SessionTemplate): SessionPlace => {
  const reach = sessionReach(template);
  return reach === 'local' || reach === 'lan' ? reach : 'remote';
};

export { placeOf };
