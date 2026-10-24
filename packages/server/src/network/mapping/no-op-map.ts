/* @layer core @kind logic */
import type { PortMapResult } from './mapping.type';

const noOpMap = (): PortMapResult => ({
  ok: false,
  reason: 'automation',
  message: 'Port mapping is off for automated launches.',
  attempts: [],
  cgnat: null,
  stop: () => Promise.resolve(),
});

export { noOpMap };
