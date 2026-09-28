/* @layer core @kind logic */
import { createLogHub } from '../local/log-hub';
import { redactSecrets } from './redact-secrets';

const createRedactingHub = () => {
  const hub = createLogHub();
  return { push: (text: string) => hub.push(redactSecrets(text)), subscribe: hub.subscribe };
};

export { createRedactingHub };
