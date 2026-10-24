/* @layer core @kind config */

const ADMIN_PROTOCOL = 'archipelia-admin';
const ADMIN_VERSION = 1;

const ADMIN_TOKEN_FILE = 'admin-token';
const OWNER_ONLY = 0o600;

const ADMIN_MAX_BYTES = 1048576;

const CLOSE_REFUSED = 4403;
const CLOSE_BAD = 4400;

export { ADMIN_MAX_BYTES, ADMIN_PROTOCOL, ADMIN_TOKEN_FILE, ADMIN_VERSION, CLOSE_BAD, CLOSE_REFUSED, OWNER_ONLY };
