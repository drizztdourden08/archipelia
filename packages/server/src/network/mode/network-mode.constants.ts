/* @layer core @kind config */
const NETWORK_MODES = ['lan', 'lan-and-internet', 'off'] as const;

const DEFAULT_NETWORK_MODE = 'lan';

const NETWORK_MODE_LABELS = {
  lan: 'LAN only',
  'lan-and-internet': 'LAN and internet',
  off: 'Off',
} as const satisfies Record<(typeof NETWORK_MODES)[number], string>;

export { DEFAULT_NETWORK_MODE, NETWORK_MODE_LABELS, NETWORK_MODES };
