/* @layer core @kind config */

const ADMIN_PATH = '/archipelia/admin';

const HEAD_END = '\r\n\r\n';
const MAX_HEAD_BYTES = 16384;

const TLS_HANDSHAKE = 0x16;

const FORBIDDEN = 'HTTP/1.1 403 Forbidden\r\nConnection: close\r\nContent-Length: 0\r\n\r\n';
const NOT_FOUND = 'HTTP/1.1 404 Not Found\r\nConnection: close\r\nContent-Length: 0\r\n\r\n';
const UPGRADE_REQUIRED = 'HTTP/1.1 426 Upgrade Required\r\nConnection: close\r\nUpgrade: websocket\r\nContent-Length: 0\r\n\r\n';

const SWEEP_INTERVAL_MS = 10 * 60 * 1000;
const PRUNE_INTERVAL_MS = 60 * 1000;
const UPGRADE_TIMEOUT_MS = 10000;
const MAX_CONNECTIONS = 512;
const MAX_CONNECTIONS_PER_ADDRESS = 32;

const LOOPBACK_HOST = '127.0.0.1';
const LOOPBACK_ADDRESSES = ['127.0.0.1', '::1', '::ffff:127.0.0.1'];

export {
  ADMIN_PATH, FORBIDDEN, HEAD_END, LOOPBACK_ADDRESSES, LOOPBACK_HOST, MAX_CONNECTIONS, MAX_CONNECTIONS_PER_ADDRESS, MAX_HEAD_BYTES, NOT_FOUND, PRUNE_INTERVAL_MS, SWEEP_INTERVAL_MS,
  TLS_HANDSHAKE, UPGRADE_REQUIRED, UPGRADE_TIMEOUT_MS,
};
