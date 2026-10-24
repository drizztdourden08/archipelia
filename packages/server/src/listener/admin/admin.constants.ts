/* @layer core @kind config */
import type { SandboxMode } from '../../sandbox/sandbox.type';

const ADMIN_PROTOCOL = 'archipelia-admin';
const ADMIN_VERSION = 1;

const ADMIN_TOKEN_FILE = 'admin-token';
const OWNER_ONLY = 0o600;

const ADMIN_MAX_BYTES = 1048576;

const CLOSE_REFUSED = 4403;
const CLOSE_BAD = 4400;

const CONSENT_NOTES: Record<SandboxMode, string> = {
  none: 'This server has no sandbox. If you allow this world, its Python code runs unconfined on this machine with your user rights.',
  bwrap: 'If you allow this world, its Python code runs in a sandbox on this server, with no network and no access to your files.',
};

export { ADMIN_MAX_BYTES, ADMIN_PROTOCOL, ADMIN_TOKEN_FILE, ADMIN_VERSION, CLOSE_BAD, CLOSE_REFUSED, CONSENT_NOTES, OWNER_ONLY };
