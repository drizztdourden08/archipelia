/* @layer electron-main @kind config */
const ADMIN_PATH = '/archipelia/admin';

const CONNECT_TIMEOUT_MS = 8000;

const CALL_TIMEOUT_MS = 30000;

const MAX_HEAD_BYTES = 16384;

const HEAD_END = '\r\n\r\n';

const WEBSOCKET_GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

const KEY_BYTES = 16;

const CLOSED_TEXT = 'The connection to the server closed.';
const REFUSED_TEXT = 'The server refused the connection.';
const TIMEOUT_TEXT = 'The server did not answer in time.';

const UNTRUSTED = 'The server uses a certificate your computer does not know. Check the fingerprint with the server owner, then trust it.';
const CHANGED = 'The certificate of this server is not the one you trusted. Trust the new one only if the server owner changed it.';

const CERTIFICATE_PROBLEMS = [
  'DEPTH_ZERO_SELF_SIGNED_CERT', 'SELF_SIGNED_CERT_IN_CHAIN', 'UNABLE_TO_VERIFY_LEAF_SIGNATURE', 'UNABLE_TO_GET_ISSUER_CERT_LOCALLY',
  'CERT_HAS_EXPIRED', 'CERT_NOT_YET_VALID', 'ERR_TLS_CERT_ALTNAME_INVALID',
];

export {
  ADMIN_PATH, CALL_TIMEOUT_MS, CERTIFICATE_PROBLEMS, CHANGED, CLOSED_TEXT, CONNECT_TIMEOUT_MS, HEAD_END, KEY_BYTES, MAX_HEAD_BYTES,
  REFUSED_TEXT, TIMEOUT_TEXT, UNTRUSTED, WEBSOCKET_GUID,
};
