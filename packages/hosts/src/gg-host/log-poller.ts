/* @layer core @kind logic */
import type { LogPollerOptions } from './log-poller.type';
import { MISSING_LOG } from './log-poller.constants';
import { completeLines } from './complete-lines';

const createLogPoller = ({ client, room, everyMs, onLine }: LogPollerOptions) => {
  let offset = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let running = true;
  let lastError = '';

  const drain = async () => {
    try {
      const { text } = await client.log(room, offset);
      if (MISSING_LOG.test(text)) return;
      const { lines, consumed } = completeLines(text);
      offset += consumed;
      lines.forEach(onLine);
      lastError = '';
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message !== lastError) onLine(`archipelago.gg log poll failed: ${message}`);
      lastError = message;
    }
  };

  const loop = async () => {
    await drain();
    if (running) schedule(everyMs);
  };

  const schedule = (delayMs: number) => {
    timer = setTimeout(() => void loop(), delayMs);
  };

  const stop = () => {
    running = false;
    clearTimeout(timer);
  };

  schedule(0);
  return { drain, stop };
};

export { createLogPoller };
