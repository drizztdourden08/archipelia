/* @layer core @kind logic */
import type { MapAttempt } from './mapping.type';

const describeMapFailure = (attempts: MapAttempt[], port: number): string => {
  const refused = attempts.filter((attempt) => attempt.outcome === 'refused');
  if (refused.length === 0) {
    return `Your router did not open port ${port}. No router answered over UPnP, NAT-PMP or PCP, so they may be off. Players outside your network cannot join unless you forward the port by hand.`;
  }
  const reasons = refused.map((attempt) => `${attempt.method}: ${attempt.detail}`).join('; ');
  return `Your router refused to open port ${port} (${reasons}). Players outside your network cannot join unless you forward the port by hand.`;
};

export { describeMapFailure };
