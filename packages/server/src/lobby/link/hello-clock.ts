/* @layer core @kind logic */
import { HELLO_TIMEOUT_MS } from '@archipelia/lobby-protocol';
import { HELLO_DEADLINE_MS } from './link.constants';

const helloClock = (onLate: () => void) => {
  const deadline = Date.now() + HELLO_DEADLINE_MS;
  const start = (ms: number) => setTimeout(onLate, Math.max(0, ms)).unref();
  let timer = start(HELLO_TIMEOUT_MS);
  const stop = () => clearTimeout(timer);
  const again = () => {
    stop();
    timer = start(Math.min(HELLO_TIMEOUT_MS, deadline - Date.now()));
  };
  return { again, stop };
};

export { helloClock };
