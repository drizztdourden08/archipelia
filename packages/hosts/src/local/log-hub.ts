/* @layer core @kind logic */
import { createLogBus } from '@drizztdourden08/brock-core/log';
import { MAX_LINES, SERVER_CHANNEL } from './log-hub.constants';
import { redactSecrets } from '../gg-host/redact-secrets';
import type { HostListener, HostLogLine } from '../session-host.type';

const createLogHub = () => {
  const bus = createLogBus({ channels: [SERVER_CHANNEL], maxEntries: MAX_LINES, mirrorToConsole: false });

  const push = (text: string) => bus.log(SERVER_CHANNEL, redactSecrets(text));

  const subscribe = (listener: HostListener) => {
    const toLine = ({ timestamp, message }: { timestamp: number; message: string }): HostLogLine => ({ at: timestamp, text: message });
    bus.getEntries().forEach((entry) => listener(toLine(entry)));
    return bus.subscribe((entry) => listener(toLine(entry)));
  };

  return { push, subscribe };
};

export { createLogHub };
