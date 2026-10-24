/* @layer core @kind config */

const UNKNOWN_AP = '0.0.0';

const MAP_TTL_S = 3600;

const SERVER_ID_FILE = 'server-id';
const SERVER_ID_BYTES = 8;
const SERVER_NAME_MAX = 64;
const NON_PRINTABLE = /[^ -~]/g;

export { MAP_TTL_S, NON_PRINTABLE, SERVER_ID_BYTES, SERVER_ID_FILE, SERVER_NAME_MAX, UNKNOWN_AP };
