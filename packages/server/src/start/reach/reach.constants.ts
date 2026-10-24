/* @layer core @kind config */

const UNKNOWN_AP = '0.0.0';

const MAP_TTL_S = 3600;

const LAN_ONLY = 'The lobby port stays on the local network until the server has TLS. Rooms can still be reached from the internet.';

const LOOKUP_NOTES = {
  off: 'The public address check is turned off.',
  skipped: 'The public address check was skipped: no router opened a port.',
  failed: 'The public address check failed, so a carrier-grade NAT could not be ruled out.',
  found: 'The public address check ran.',
} as const;

const SERVER_ID_FILE = 'server-id';
const SERVER_ID_BYTES = 8;
const SERVER_NAME_MAX = 64;
const NON_PRINTABLE = /[^ -~]/g;

export { LAN_ONLY, LOOKUP_NOTES, MAP_TTL_S, NON_PRINTABLE, SERVER_ID_BYTES, SERVER_ID_FILE, SERVER_NAME_MAX, UNKNOWN_AP };
