/* @layer server @kind config */
const TLS_KEY_FILE = 'tls/key.pem';
const TLS_CERT_FILE = 'tls/cert.pem';
const CERT_VALID_DAYS = 3650;
const CERT_RENEW_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;
const OWNER_ONLY = 0o600;
const SERIAL_BYTES = 16;
const KEY_CURVE = 'P-256';
const SIGNING = { name: 'ECDSA', hash: 'SHA-256' } as const;

export { CERT_RENEW_DAYS, CERT_VALID_DAYS, DAY_MS, KEY_CURVE, OWNER_ONLY, SERIAL_BYTES, SIGNING, TLS_CERT_FILE, TLS_KEY_FILE };
