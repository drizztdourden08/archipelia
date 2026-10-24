/* @layer protocol @kind config */

const DISCOVERY_SERVICE = '_archipelia._tcp';
const DISCOVERY_TXT_KEYS = { name: 'name', id: 'id', protocol: 'proto', ap: 'ap', open: 'open' } as const;
const DISCOVERY_TXT_VALUE_MAX_BYTES = 255;

const BEACON_APP = 'archipelia';
const BEACON_PORT = 38291;
const BEACON_MAX_BYTES = 512;
const BEACON_INTERVAL_MS = 5000;
const BEACON_EXPIRY_MS = 15000;

export {
  BEACON_APP,
  BEACON_EXPIRY_MS,
  BEACON_INTERVAL_MS,
  BEACON_MAX_BYTES,
  BEACON_PORT,
  DISCOVERY_SERVICE,
  DISCOVERY_TXT_KEYS,
  DISCOVERY_TXT_VALUE_MAX_BYTES,
};
