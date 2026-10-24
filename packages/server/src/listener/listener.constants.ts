/* @layer core @kind config */

const ADMIN_PATH = '/archipelia/admin';

const HEAD_END = '\r\n\r\n';
const MAX_HEAD_BYTES = 16384;

const TLS_HANDSHAKE = 0x16;

const NOT_FOUND = 'HTTP/1.1 404 Not Found\r\nConnection: close\r\nContent-Length: 0\r\n\r\n';
const UPGRADE_REQUIRED = 'HTTP/1.1 426 Upgrade Required\r\nConnection: close\r\nUpgrade: websocket\r\nContent-Length: 0\r\n\r\n';

const SWEEP_INTERVAL_MS = 10 * 60 * 1000;

const LOOPBACK_ADDRESSES = ['127.0.0.1', '::1', '::ffff:127.0.0.1'];

export { ADMIN_PATH, HEAD_END, LOOPBACK_ADDRESSES, MAX_HEAD_BYTES, NOT_FOUND, SWEEP_INTERVAL_MS, TLS_HANDSHAKE, UPGRADE_REQUIRED };
